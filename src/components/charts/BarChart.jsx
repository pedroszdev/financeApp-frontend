import { Bar } from 'react-chartjs-2';
import { ensureChartJS } from './chartSetup';
import { formatCurrency } from '../../utils/formatCurrency';

ensureChartJS();

export default function BarChart({ labels = [], receita = [], despesa = [] }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Receitas',
        data: receita,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6,
        maxBarThickness: 28,
      },
      {
        label: 'Despesas',
        data: despesa,
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8 } },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` },
      },
    },
    scales: {
      y: {
        ticks: { callback: (v) => formatCurrency(v) },
        grid: { color: 'rgba(15, 23, 42, 0.06)' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="h-[260px] sm:h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
}
