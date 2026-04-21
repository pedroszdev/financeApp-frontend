import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { weekOfMonth } from '../utils/formatDate';
import { CATEGORIA_ICONE } from '../utils/constants';
import { useToast } from '../hooks/useToast';
import BarChart from '../components/charts/BarChart';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';

const MAX_PAGES_TO_FETCH = 5; // 100 transações — best effort

async function fetchAllTransactionsOfMonth() {
  const out = [];
  for (let page = 1; page <= MAX_PAGES_TO_FETCH; page++) {
    const res = await api.transacoes.list({ page });
    const list = res?.transacoes || [];
    out.push(...list);
    if (!res?.totalPages || page >= res.totalPages) break;
  }
  const now = new Date();
  return out.filter((t) => {
    const d = new Date(t.data);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
}

export default function Reports() {
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [monthTransacoes, setMonthTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [dash, month] = await Promise.all([
          api.dashboard.get(),
          fetchAllTransactionsOfMonth(),
        ]);
        if (cancelled) return;
        setDashboard(dash);
        setMonthTransacoes(month);
      } catch (err) {
        if (!cancelled && err.status !== 401) {
          toast.error(err.message || 'Erro ao carregar relatórios');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const receita = Number(dashboard?.receitaMesAtual || 0);
  const despesa = Number(dashboard?.despesaMesAtual || 0);
  const saldoMes = receita - despesa;

  const ranking = useMemo(() => {
    const obj = dashboard?.dadosCategoria || {};
    return Object.entries(obj)
      .map(([categoria, valor]) => ({ categoria, valor: Number(valor) || 0 }))
      .sort((a, b) => b.valor - a.valor);
  }, [dashboard]);
  const totalRanking = ranking.reduce((a, b) => a + b.valor, 0);

  const weekly = useMemo(() => {
    const buckets = { 1: { receita: 0, despesa: 0 }, 2: { receita: 0, despesa: 0 }, 3: { receita: 0, despesa: 0 }, 4: { receita: 0, despesa: 0 }, 5: { receita: 0, despesa: 0 }, 6: { receita: 0, despesa: 0 } };
    monthTransacoes.forEach((t) => {
      const w = weekOfMonth(t.data);
      const bucket = buckets[w] || (buckets[w] = { receita: 0, despesa: 0 });
      const v = Number(t.valor) || 0;
      if (t.tipo === 'Receita') bucket.receita += v;
      else if (t.tipo === 'Despesa') bucket.despesa += v;
    });
    const weeks = Object.keys(buckets)
      .map((k) => Number(k))
      .filter((k) => buckets[k].receita > 0 || buckets[k].despesa > 0)
      .sort((a, b) => a - b);
    return {
      labels: weeks.map((w) => `Sem. ${w}`),
      receita: weeks.map((w) => buckets[w].receita),
      despesa: weeks.map((w) => buckets[w].despesa),
    };
  }, [monthTransacoes]);

  const now = new Date();
  const periodoLabel = now.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[20px] font-semibold text-ink-900 sm:text-[24px]">
            Relatórios
          </h1>
          <p className="text-[13px] text-ink-500 capitalize">
            Período: {periodoLabel}
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card">
          <span className="label">Receitas do período</span>
          {loading ? (
            <Skeleton height={28} width={140} className="mt-2" />
          ) : (
            <div className="mt-1 text-[22px] font-semibold text-brand-green">
              {formatCurrency(receita)}
            </div>
          )}
        </div>
        <div className="card">
          <span className="label">Despesas do período</span>
          {loading ? (
            <Skeleton height={28} width={140} className="mt-2" />
          ) : (
            <div className="mt-1 text-[22px] font-semibold text-brand-red">
              {formatCurrency(despesa)}
            </div>
          )}
        </div>
        <div className="card">
          <span className="label">Saldo do período</span>
          {loading ? (
            <Skeleton height={28} width={140} className="mt-2" />
          ) : (
            <div
              className={`mt-1 text-[22px] font-semibold ${
                saldoMes >= 0 ? 'text-brand-green' : 'text-brand-red'
              }`}
            >
              {formatCurrency(saldoMes)}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-[16px] font-semibold text-ink-900">
            Ranking de categorias (despesas)
          </h2>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={32} />
              ))}
            </div>
          ) : ranking.length === 0 ? (
            <EmptyState
              icon="📊"
              title="Sem despesas no mês"
              description="Registre despesas para visualizar o ranking por categoria."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {ranking.map((r, i) => {
                const pct =
                  totalRanking > 0 ? Math.round((r.valor / totalRanking) * 100) : 0;
                return (
                  <li key={r.categoria} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="flex items-center gap-2 font-medium text-ink-900">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink-100 text-[11px] font-semibold text-ink-500"
                        >
                          {i + 1}
                        </span>
                        <span aria-hidden="true">
                          {CATEGORIA_ICONE[r.categoria] || '💠'}
                        </span>
                        {r.categoria}
                      </span>
                      <span className="text-ink-500">
                        {formatCurrency(r.valor)} · {pct}%
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-ink-100"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full rounded-full bg-brand-blue"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="mb-4 text-[16px] font-semibold text-ink-900">
            Por semana do mês
          </h2>
          {loading ? (
            <Skeleton height={260} />
          ) : weekly.labels.length === 0 ? (
            <EmptyState
              icon="📅"
              title="Sem atividade no mês"
              description="Assim que você registrar transações, elas serão agrupadas por semana."
            />
          ) : (
            <BarChart
              labels={weekly.labels}
              receita={weekly.receita}
              despesa={weekly.despesa}
            />
          )}
          <p className="mt-3 text-[12px] text-ink-500">
            Considera até {MAX_PAGES_TO_FETCH * 20} transações mais recentes do mês.
          </p>
        </div>
      </section>
    </div>
  );
}
