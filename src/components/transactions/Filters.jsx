import { useId } from 'react';
import Select from '../ui/Select';
import { CATEGORIA_FILTRO, TIPO_FILTRO } from '../../utils/constants';

export default function Filters({ value, onChange, onReset }) {
  const searchId = useId();
  const hasFilter =
    !!value.search ||
    (value.tipo && value.tipo !== 'todas') ||
    (value.categoria && value.categoria !== 'todas');

  return (
    <div className="card flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label htmlFor={searchId} className="label">
          Buscar
        </label>
        <input
          id={searchId}
          type="search"
          className="input"
          placeholder="Buscar por descrição"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value, page: 1 })}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="Tipo"
          value={value.tipo}
          onChange={(e) => onChange({ ...value, tipo: e.target.value, page: 1 })}
          options={TIPO_FILTRO}
        />
        <Select
          label="Categoria"
          value={value.categoria}
          onChange={(e) => onChange({ ...value, categoria: e.target.value, page: 1 })}
          options={CATEGORIA_FILTRO}
        />
      </div>
      <button
        type="button"
        onClick={onReset}
        disabled={!hasFilter}
        className="btn btn-ghost sm:self-end"
      >
        Limpar filtros
      </button>
    </div>
  );
}
