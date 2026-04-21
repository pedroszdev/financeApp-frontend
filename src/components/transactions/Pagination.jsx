export default function Pagination({ currentPage, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[13px] text-ink-500">
        Página {currentPage} de {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canPrev}
          onClick={() => canPrev && onChange(currentPage - 1)}
        >
          ← Anterior
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canNext}
          onClick={() => canNext && onChange(currentPage + 1)}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
