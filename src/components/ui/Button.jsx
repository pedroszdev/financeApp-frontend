import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'danger'
      ? 'btn-danger'
      : variant === 'ghost'
      ? 'btn-ghost'
      : 'btn-secondary';
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      <span>{children}</span>
    </button>
  );
}
