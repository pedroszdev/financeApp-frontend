export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="text-4xl" aria-hidden="true">
        {icon}
      </div>
      {title && <h3 className="text-[16px] font-semibold text-ink-900">{title}</h3>}
      {description && (
        <p className="max-w-sm text-[14px] text-ink-500">{description}</p>
      )}
      {action}
    </div>
  );
}
