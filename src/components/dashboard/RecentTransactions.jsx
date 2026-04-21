import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { CATEGORIA_ICONE } from '../../utils/constants';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

export default function RecentTransactions({ items = [], loading = false }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink-900">Transações recentes</h2>
        <Link
          to="/transactions"
          className="text-[13px] font-medium text-brand-blue hover:underline"
        >
          Ver todas →
        </Link>
      </div>

      {loading ? (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton height={36} width={36} rounded="rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton height={14} width="55%" />
                <Skeleton height={12} width="35%" />
              </div>
              <Skeleton height={14} width={72} />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="Sem transações ainda"
          description="Quando você registrar receitas ou despesas, elas aparecerão aqui."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-ink-100">
          {items.map((t) => {
            const isReceita = t.tipo === 'Receita';
            return (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <div
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink-100 text-[16px]"
                  aria-hidden="true"
                >
                  {CATEGORIA_ICONE[t.categoria] || '💠'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-ink-900">
                    {t.descricao}
                  </div>
                  <div className="text-[12px] text-ink-500">
                    {t.categoria} · {formatDate(t.data)}
                  </div>
                </div>
                <div
                  className={`flex-none text-[14px] font-semibold ${
                    isReceita ? 'text-brand-green' : 'text-brand-red'
                  }`}
                >
                  {isReceita ? '+' : '−'} {formatCurrency(t.valor)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
