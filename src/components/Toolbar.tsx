import { useEffect, useState } from "react";
import { EMPTY_FILTERS, type Filters } from "../data";
import { labelOptions, useI18n } from "../i18n";

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function Toolbar({ filters, onChange }: Props) {
  const { lang, t } = useI18n();
  // A busca espera o usuário parar de digitar antes de filtrar.
  const [name, setName] = useState(filters.name);
  useEffect(() => {
    setName(filters.name);
  }, [filters.name]);
  useEffect(() => {
    if (name === filters.name) return;
    const timer = setTimeout(() => onChange({ ...filters, name: name.trim() }), 250);
    return () => clearTimeout(timer);
  }, [name, filters, onChange]);

  const active = Object.values(filters).some(Boolean);

  return (
    <div className="toolbar" role="search">
      <label className="search">
        <span className="sr-only">{t.searchCharacter}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder={t.searchName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>
      <Select label={t.status} value={filters.status} options={labelOptions(lang, "status")} onChange={(status) => onChange({ ...filters, status })} />
      <Select label={t.species} value={filters.species} options={labelOptions(lang, "species")} onChange={(species) => onChange({ ...filters, species })} />
      <Select label={t.gender} value={filters.gender} options={labelOptions(lang, "gender")} onChange={(gender) => onChange({ ...filters, gender })} />
      {active && (
        <button type="button" className="clear" onClick={() => onChange(EMPTY_FILTERS)}>
          {t.clear}
        </button>
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Record<string, string>; onChange: (v: string) => void }) {
  const { t } = useI18n();
  return (
    <label className="select">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} data-active={value !== ""}>
        <option value="">{t.all(label)}</option>
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
