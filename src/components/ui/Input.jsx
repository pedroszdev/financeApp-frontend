import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, hint, error, className = '', id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`input ${error ? 'input--error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-[12px] text-brand-red">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-[12px] text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
