export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden flex-col justify-between bg-brand-navy p-12 text-white lg:flex lg:w-1/2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue text-[16px] font-bold">
            F
          </div>
          <span className="text-[18px] font-semibold">FinanceApp</span>
        </div>
        <div className="space-y-5">
          <h2 className="text-[28px] font-semibold leading-tight">
            Controle suas finanças com clareza.
          </h2>
          <p className="max-w-md text-[14px] text-white/70">
            Acompanhe receitas, despesas e categorias em um único lugar. Visualize
            sua evolução financeira com gráficos simples e diretos.
          </p>
          <ul className="space-y-2 text-[13px] text-white/70">
            <li>• Cadastro de receitas e despesas em segundos</li>
            <li>• Gráficos de evolução e distribuição por categoria</li>
            <li>• Filtros inteligentes para encontrar qualquer transação</li>
          </ul>
        </div>
        <div className="text-[12px] text-white/40">
          © {new Date().getFullYear()} FinanceApp
        </div>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-navy text-[14px] font-bold text-white">
              F
            </div>
            <span className="text-[16px] font-semibold text-ink-900">FinanceApp</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
