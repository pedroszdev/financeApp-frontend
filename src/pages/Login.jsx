import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export default function Login() {
  const { login, isAuthenticated, sessionExpired, clearSessionExpired } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    if (sessionExpired) {
      toast.info('Sessão expirada. Faça login novamente.');
      clearSessionExpired();
    }
  }, [sessionExpired, toast, clearSessionExpired]);

  const validate = () => {
    const next = {};
    if (!email) next.email = 'Informe seu e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'E-mail inválido';
    if (!senha) next.senha = 'Informe sua senha';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email, senha });
      toast.success('Bem-vindo de volta!');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-ink-900">Entrar</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Acesse sua conta para gerenciar suas finanças.
        </p>
      </div>

      {submitError && (
        <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-brand-red">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validate}
          error={errors.email}
          placeholder="voce@exemplo.com"
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onBlur={validate}
          error={errors.senha}
          placeholder="Sua senha"
        />
        <Button type="submit" loading={loading} className="w-full">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink-500">
        Ainda não tem conta?{' '}
        <Link to="/register" className="font-medium text-brand-blue hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}
