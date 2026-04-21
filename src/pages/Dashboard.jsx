import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import LineChart from '../components/charts/LineChart';
import DonutChart from '../components/charts/DonutChart';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

function monthlyToChart(dados6meses) {
  if (!dados6meses) return { labels: [], receita: [], despesa: [] };
  const labels = Object.keys(dados6meses);
  const receita = labels.map((l) => Number(dados6meses[l]?.receita ?? 0));
  const despesa = labels.map((l) => Number(dados6meses[l]?.despesa ?? 0));
  return { labels, receita, despesa };
}

function categoriesToChart(dadosCategoria) {
  if (!dadosCategoria) return { labels: [], data: [] };
  const entries = Object.entries(dadosCategoria).sort((a, b) => b[1] - a[1]);
  return {
    labels: entries.map(([k]) => k),
    data: entries.map(([, v]) => Number(v || 0)),
  };
}

export default function Dashboard() {
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadingRecent(true);
      try {
        const [dash, list] = await Promise.all([
          api.dashboard.get(),
          api.transacoes.list({ page: 1 }),
        ]);
        if (cancelled) return;
        setDashboard(dash);
        setRecent((list?.transacoes || []).slice(0, 5));
      } catch (err) {
        if (!cancelled && err.status !== 401) {
          toast.error(err.message || 'Erro ao carregar dashboard');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingRecent(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const line = useMemo(() => monthlyToChart(dashboard?.dados6meses), [dashboard]);
  const donut = useMemo(() => categoriesToChart(dashboard?.dadosCategoria), [dashboard]);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          label="Saldo Total"
          value={dashboard?.saldo}
          variant="balance"
          icon="👛"
          loading={loading}
          hint="Receitas − Despesas de todo o histórico"
        />
        <SummaryCard
          label="Receitas do Mês"
          value={dashboard?.receitaMesAtual}
          variant="income"
          icon="↗"
          loading={loading}
          hint="Entradas registradas no mês atual"
        />
        <SummaryCard
          label="Despesas do Mês"
          value={dashboard?.despesaMesAtual}
          variant="expense"
          icon="↘"
          loading={loading}
          hint="Saídas registradas no mês atual"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink-900">
              Receitas vs Despesas
            </h2>
            <span className="text-[12px] text-ink-500">Últimos 6 meses</span>
          </div>
          {loading ? (
            <Skeleton height={280} className="w-full" />
          ) : line.labels.length === 0 ? (
            <EmptyState
              icon="📉"
              title="Sem dados por enquanto"
              description="Registre transações para visualizar a evolução mensal."
            />
          ) : (
            <LineChart
              labels={line.labels}
              receita={line.receita}
              despesa={line.despesa}
            />
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink-900">
              Despesas por Categoria
            </h2>
            <span className="text-[12px] text-ink-500">Mês atual</span>
          </div>
          {loading ? (
            <Skeleton height={280} className="w-full" />
          ) : donut.labels.length === 0 ? (
            <EmptyState
              icon="🥧"
              title="Nenhuma despesa neste mês"
              description="Ao registrar despesas, elas serão distribuídas aqui por categoria."
            />
          ) : (
            <DonutChart labels={donut.labels} data={donut.data} />
          )}
        </div>
      </section>

      <section>
        <RecentTransactions items={recent} loading={loadingRecent} />
      </section>
    </div>
  );
}
