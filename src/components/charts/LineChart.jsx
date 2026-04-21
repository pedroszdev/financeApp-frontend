import { Line } from 'react-chartjs-2';
import { ensureChartJS } from './chartSetup';
import { formatCurrency } from '../../utils/formatCurrency';

ensureChartJS();

export default function LineChart({ labels, receita = [], despesa = [] }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Receitas',
        data: receita,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Despesas',
        data: despesa,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#ef4444',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8 },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: { callback: (v) => formatCurrency(v) },
        grid: { color: 'rgba(15, 23, 42, 0.06)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-[280px] sm:h-[320px]">
      <Line data={data} options={options} />
    </div>
  );
}
