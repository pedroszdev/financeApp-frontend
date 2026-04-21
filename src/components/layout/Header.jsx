import { useState } from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

function initials(nome) {
  if (!nome) return 'U';
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header({ onOpenSidebar, title }) {
  const { user, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink-100 bg-white/85 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-ghost rounded-sm p-2 lg:hidden"
          aria-label="Abrir menu"
          onClick={onOpenSidebar}
        >
          <span aria-hidden="true" className="text-[20px]">
            ☰
          </span>
        </button>
        {title && (
          <h1 className="text-[16px] font-semibold text-ink-900 sm:text-[20px]">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-[13px] font-medium text-ink-900">
            {user?.nome || 'Usuário'}
          </div>
          <div className="text-[12px] text-ink-500">{user?.email}</div>
        </div>
        <div
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-[13px] font-semibold text-white"
        >
          {initials(user?.nome)}
        </div>
        <Button
          variant="secondary"
          onClick={handleLogout}
          loading={logoutLoading}
          className="hidden sm:inline-flex"
        >
          Sair
        </Button>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-ghost rounded-sm p-2 sm:hidden"
          aria-label="Sair"
        >
          ⏻
        </button>
      </div>
    </header>
  );
}
