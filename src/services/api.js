import { STORAGE_KEYS, AUTH_EVENT } from '../utils/constants';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.access);
}

function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refresh);
}

function setTokens({ accesstoken, refreshtoken }) {
  if (accesstoken) localStorage.setItem(STORAGE_KEYS.access, accesstoken);
  if (refreshtoken) localStorage.setItem(STORAGE_KEYS.refresh, refreshtoken);
}

function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.access);
  localStorage.removeItem(STORAGE_KEYS.refresh);
  localStorage.removeItem(STORAGE_KEYS.user);
}

function emitAuthExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}

// Evita múltiplas corridas de refresh em paralelo.
let refreshPromise = null;

async function performRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');
  const res = await fetch(`${BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('REFRESH_FAILED');
  const body = await res.json();
  if (!body.accesstoken || !body.refreshtoken) throw new Error('REFRESH_FAILED');
  setTokens(body);
  return body.accesstoken;
}

function buildHeaders(extra = {}, { withAuth = true } = {}) {
  const h = { 'Content-Type': 'application/json', ...extra };
  if (withAuth) {
    const token = getAccessToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }
  return h;
}

async function request(path, options = {}) {
  const { withAuth = true, _retry = false, headers, body, ...rest } = options;
  const init = {
    ...rest,
    headers: buildHeaders(headers, { withAuth }),
  };
  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch (e) {
    const err = new Error('Sem conexão com o servidor. Verifique sua internet.');
    err.cause = e;
    err.network = true;
    throw err;
  }

  if (res.status === 401 && withAuth && !_retry && getRefreshToken()) {
    try {
      refreshPromise = refreshPromise || performRefresh();
      await refreshPromise;
      refreshPromise = null;
      return request(path, { ...options, _retry: true });
    } catch (e) {
      refreshPromise = null;
      clearTokens();
      emitAuthExpired();
      const err = new Error('Sessão expirada. Faça login novamente.');
      err.status = 401;
      throw err;
    }
  }

  if (res.status === 401) {
    clearTokens();
    emitAuthExpired();
    const err = new Error('Sessão expirada. Faça login novamente.');
    err.status = 401;
    throw err;
  }

  const data = await parseBody(res);

  if (!res.ok) {
    const message =
      (data && (data.error || data.erro || data.message)) ||
      `Erro ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  request,
  auth: {
    login: (body) =>
      request('/login', { method: 'POST', body, withAuth: false }),
    register: (body) =>
      request('/user', { method: 'POST', body, withAuth: false }),
    logout: () => request('/logout', { method: 'GET' }),
  },
  dashboard: {
    get: () => request('/', { method: 'GET' }),
  },
  transacoes: {
    list: (params = {}) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.set(k, v);
      });
      const suffix = qs.toString() ? `?${qs.toString()}` : '';
      return request(`/transacoes${suffix}`);
    },
    create: (body) => request('/transacao', { method: 'POST', body }),
    update: (id, body) =>
      request(`/transacao/edit/${id}`, { method: 'PUT', body }),
    remove: (id) =>
      request(`/transacao/delete/${id}`, { method: 'DELETE' }),
  },
};

export const tokens = { setTokens, clearTokens, getAccessToken, getRefreshToken };
