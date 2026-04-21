import { useToast } from '../../hooks/useToast';

const styles = {
  success: 'bg-emerald-50 text-brand-green border-emerald-200',
  error: 'bg-red-50 text-brand-red border-red-200',
  info: 'bg-blue-50 text-brand-blue border-blue-200',
};

const icons = { success: '✓', error: '!', info: 'i' };

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex items-start gap-3 rounded-md border px-4 py-3 shadow-card ${styles[t.variant] || styles.info}`}
        >
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/70 text-[12px] font-bold"
          >
            {icons[t.variant] || icons.info}
          </span>
          <p className="flex-1 text-[13px] leading-snug">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="text-[12px] text-ink-500 hover:text-ink-900"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
