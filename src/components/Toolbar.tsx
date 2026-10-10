import { useEffect, useState } from "react";
import { EMPTY_FILTERS, type Filters } from "../data";
import { GENDER, SPECIES, STATUS } from "../labels";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function Toolbar({ filters, onChange }: Props) {
  // A busca espera o usuário parar de digitar antes de consultar a API.
  const [name, setName] = useState(filters.name);
  useEffect(() => setName(filters.name), [filters.name]);
  useEffect(() => {
    if (name === filters.name) return;
    const timer = setTimeout(() => onChange({ ...filters, name: name.trim() }), 350);
    return () => clearTimeout(timer);
  }, [name, filters, onChange]);

  const active = Object.values(filters).some(Boolean);

  return (
    <div className="toolbar" role="search">
      <label className="search">
        <span className="sr-only">Buscar personagem pelo nome</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Buscar pelo nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>
      <Select label="Situação" value={filters.status} options={STATUS} onChange={(status) => onChange({ ...filters, status })} />
      <Select label="Espécie" value={filters.species} options={SPECIES} onChange={(species) => onChange({ ...filters, species })} />
      <Select label="Gênero" value={filters.gender} options={GENDER} onChange={(gender) => onChange({ ...filters, gender })} />
      {active && (
        <button type="button" className="clear" onClick={() => onChange(EMPTY_FILTERS)}>
          Limpar
        </button>
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Record<string, string>; onChange: (v: string) => void }) {
  return (
    <label className="select">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} data-active={value !== ""}>
        <option value="">{label}: todos</option>
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
