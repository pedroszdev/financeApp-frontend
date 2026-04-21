import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import { CATEGORIA_ICONE } from '../../utils/constants';

export default function TransactionTable({ items = [], onEdit, onDelete }) {
  return (
    <div className="card hidden overflow-hidden p-0 md:block">
      <table className="min-w-full divide-y divide-ink-100 text-[14px]">
        <thead className="bg-ink-50 text-left text-[12px] uppercase tracking-wide text-ink-500">
          <tr>
            <th className="px-4 py-3 font-medium">Descrição</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 text-right font-medium">Valor</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {items.map((t) => {
            const isReceita = t.tipo === 'Receita';
            return (
              <tr key={t.id} className="hover:bg-ink-50/60">
                <td className="px-4 py-3 font-medium text-ink-900">{t.descricao}</td>
                <td className="px-4 py-3 text-ink-500">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">
                      {CATEGORIA_ICONE[t.categoria] || '💠'}
                    </span>
                    {t.categoria}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-500">{formatDate(t.data)}</td>
                <td className="px-4 py-3">
                  <Badge tipo={t.tipo} />
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    isReceita ? 'text-brand-green' : 'text-brand-red'
                  }`}
                >
                  {isReceita ? '+' : '−'} {formatCurrency(t.valor)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="btn-ghost rounded-sm p-2"
                      title="Editar"
                      aria-label={`Editar ${t.descricao}`}
                      onClick={() => onEdit?.(t)}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="btn-ghost rounded-sm p-2"
                      title="Excluir"
                      aria-label={`Excluir ${t.descricao}`}
                      onClick={() => onDelete?.(t)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
