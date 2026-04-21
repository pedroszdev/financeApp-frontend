import { Doughnut } from 'react-chartjs-2';
import { ensureChartJS } from './chartSetup';
import { formatCurrency } from '../../utils/formatCurrency';

ensureChartJS();

const PALETTE = [
  '#2563eb',
  '#10b981',
  '#ef4444',
  '#f97316',
  '#8b5cf6',
  '#14b8a6',
  '#eab308',
  '#ec4899',
];

export default function DonutChart({ labels = [], data = [] }) {
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const total = data.reduce((a, b) => a + Number(b || 0), 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = Number(ds.data[i] || 0);
              const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
              return {
                text: `${label} · ${pct}%`,
                fillStyle: ds.backgroundColor[i],
                strokeStyle: ds.backgroundColor[i],
                pointStyle: 'circle',
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="h-[280px] sm:h-[320px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
