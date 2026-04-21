import { forwardRef, useId } from 'react';

const Select = forwardRef(function Select(
  { label, error, options = [], className = '', id, placeholder, ...rest },
  ref
) {
  const autoId = useId();
  const selectId = id || autoId;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`input ${error ? 'input--error' : ''} ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && <p className="text-[12px] text-brand-red">{error}</p>}
    </div>
  );
});

export default Select;
