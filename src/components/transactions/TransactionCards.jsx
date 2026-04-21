import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import { CATEGORIA_ICONE } from '../../utils/constants';

export default function TransactionCards({ items = [], onEdit, onDelete }) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {items.map((t) => {
        const isReceita = t.tipo === 'Receita';
        return (
          <li key={t.id} className="card flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink-100 text-[18px]"
                  aria-hidden="true"
                >
                  {CATEGORIA_ICONE[t.categoria] || '💠'}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-medium text-ink-900">
                    {t.descricao}
                  </div>
                  <div className="text-[12px] text-ink-500">
                    {t.categoria} · {formatDate(t.data)}
                  </div>
                </div>
              </div>
              <Badge tipo={t.tipo} />
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`text-[18px] font-semibold ${
                  isReceita ? 'text-brand-green' : 'text-brand-red'
                }`}
              >
                {isReceita ? '+' : '−'} {formatCurrency(t.valor)}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn-ghost rounded-sm p-2"
                  aria-label={`Editar ${t.descricao}`}
                  onClick={() => onEdit?.(t)}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="btn-ghost rounded-sm p-2"
                  aria-label={`Excluir ${t.descricao}`}
                  onClick={() => onDelete?.(t)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
