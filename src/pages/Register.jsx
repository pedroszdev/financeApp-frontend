import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const RULES = [
  { key: 'len', label: 'Mínimo de 8 caracteres', test: (s) => s.length >= 8 },
  { key: 'upper', label: '1 letra maiúscula', test: (s) => /[A-Z]/.test(s) },
  { key: 'lower', label: '1 letra minúscula', test: (s) => /[a-z]/.test(s) },
  { key: 'digit', label: '1 número', test: (s) => /\d/.test(s) },
  {
    key: 'special',
    label: '1 caractere especial (! % $ * & @ #)',
    test: (s) => /[!%$*&@#]/.test(s),
  },
  {
    key: 'norepeat',
    label: 'Sem caracteres repetidos em sequência (aa, 11…)',
    test: (s) => s.length === 0 || !/(.)\1/.test(s),
  },
];

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const ruleStatus = useMemo(
    () => RULES.map((r) => ({ ...r, ok: r.test(form.senha) })),
    [form.senha]
  );
  const senhaValida = ruleStatus.every((r) => r.ok);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.nome || form.nome.trim().length < 3)
      next.nome = 'Nome precisa ter ao menos 3 caracteres';
    if (!form.email) next.email = 'Informe seu e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'E-mail inválido';
    if (!senhaValida) next.senha = 'Sua senha ainda não atende a todas as regras';
    if (form.senha !== form.confirm)
      next.confirm = 'As senhas não coincidem';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
      });
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível criar a conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-ink-900">Criar conta</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Comece a organizar suas finanças em minutos.
        </p>
      </div>

      {submitError && (
        <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-brand-red">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Nome"
          autoComplete="name"
          value={form.nome}
          onChange={update('nome')}
          error={errors.nome}
          placeholder="Seu nome"
        />
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          placeholder="voce@exemplo.com"
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          value={form.senha}
          onChange={update('senha')}
          error={errors.senha}
          placeholder="Crie uma senha forte"
        />
        <ul className="-mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {ruleStatus.map((r) => (
            <li
              key={r.key}
              className={`flex items-center gap-2 text-[12px] ${
                r.ok ? 'text-brand-green' : 'text-ink-500'
              }`}
            >
              <span aria-hidden="true">{r.ok ? '✓' : '○'}</span>
              {r.label}
            </li>
          ))}
        </ul>
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
          placeholder="Repita a senha"
        />
        <Button type="submit" loading={loading} className="w-full">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink-500">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-medium text-brand-blue hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
