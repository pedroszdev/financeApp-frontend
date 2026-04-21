export const CATEGORIAS = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Moradia',
  'Vestuário',
  'Outros',
];

export const TIPOS = ['Receita', 'Despesa'];

export const TIPO_FILTRO = [
  { value: 'todas', label: 'Todos os tipos' },
  { value: 'Receita', label: 'Receita' },
  { value: 'Despesa', label: 'Despesa' },
];

export const CATEGORIA_FILTRO = [
  { value: 'todas', label: 'Todas as categorias' },
  ...CATEGORIAS.map((c) => ({ value: c, label: c })),
];

export const STORAGE_KEYS = {
  access: 'financeapp.accesstoken',
  refresh: 'financeapp.refreshtoken',
  user: 'financeapp.user',
};

export const AUTH_EVENT = 'financeapp:auth-expired';

// Ícone simples (emoji) por categoria — sem dependência de biblioteca de ícones.
export const CATEGORIA_ICONE = {
  Alimentação: '🍽️',
  Transporte: '🚌',
  Saúde: '💊',
  Educação: '📚',
  Lazer: '🎮',
  Moradia: '🏠',
  Vestuário: '👕',
  Outros: '📦',
};
