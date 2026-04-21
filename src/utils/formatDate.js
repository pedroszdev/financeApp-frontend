export function formatDate(value) {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function toISODate(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function weekOfMonth(date) {
  const d = date instanceof Date ? date : new Date(date);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const dayOfMonth = d.getDate();
  const offset = first.getDay();
  return Math.ceil((dayOfMonth + offset) / 7);
}
