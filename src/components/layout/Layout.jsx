import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/reports': 'Relatórios',
};

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const title =
    TITLES[location.pathname] ||
    (location.pathname.startsWith('/transactions') ? 'Transações' : 'FinanceApp');

  return (
    <div className="flex min-h-full bg-ink-50">
      <aside className="hidden w-[240px] flex-none lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setDrawerOpen(true)} title={title} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
