export default function Badge({ tipo, children, className = '' }) {
  const variantClass =
    tipo === 'Receita' ? 'badge-income' : tipo === 'Despesa' ? 'badge-expense' : 'bg-ink-100 text-ink-500';
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children ?? tipo}
    </span>
  );
}
