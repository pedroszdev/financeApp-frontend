import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Transações', icon: '💸' },
  { to: '/reports', label: 'Relatórios', icon: '📈' },
];

export default function Sidebar({ onNavigate }) {
  return (
    <nav className="flex h-full flex-col gap-1 bg-brand-navy p-4 text-white">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-blue text-[15px] font-bold">
          F
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold">FinanceApp</div>
          <div className="text-[12px] text-white/60">Controle pessoal</div>
        </div>
      </div>
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2 text-[14px] transition ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span aria-hidden="true" className="text-[16px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto px-2 pt-6 text-[12px] text-white/50">
        v0.1 · {new Date().getFullYear()}
      </div>
    </nav>
  );
}
