import { formatCurrency } from '../../utils/formatCurrency';
import Skeleton from '../ui/Skeleton';

const VARIANTS = {
  neutral: { valueClass: 'text-ink-900', iconBg: 'bg-ink-100 text-brand-navy' },
  balance: { valueClass: 'text-brand-navy', iconBg: 'bg-blue-50 text-brand-blue' },
  income: { valueClass: 'text-brand-green', iconBg: 'bg-emerald-50 text-brand-green' },
  expense: { valueClass: 'text-brand-red', iconBg: 'bg-red-50 text-brand-red' },
};

export default function SummaryCard({ label, value, variant = 'neutral', icon = '💰', loading = false, hint }) {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <div className="card flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span className="label">{label}</span>
        {loading ? (
          <Skeleton height={28} width={140} />
        ) : (
          <span className={`text-[24px] font-semibold leading-tight sm:text-[28px] ${v.valueClass}`}>
            {formatCurrency(value)}
          </span>
        )}
        {hint && !loading && (
          <span className="text-[12px] text-ink-500">{hint}</span>
        )}
      </div>
      <div
        className={`flex h-10 w-10 flex-none items-center justify-center rounded-md text-[18px] ${v.iconBg}`}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  );
}
