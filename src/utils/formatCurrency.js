const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  const n = typeof value === 'string' ? Number(value) : value;
  if (n === null || n === undefined || Number.isNaN(n)) {
    return 'R$ 0,00';
  }
  return formatter.format(n);
}

export function parseCurrencyInput(raw) {
  if (raw === '' || raw === null || raw === undefined) return 0;
  const normalized = String(raw).replace(/\./g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isNaN(n) ? 0 : n;
}
