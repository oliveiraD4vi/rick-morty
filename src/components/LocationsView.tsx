import { useMemo, useState } from "react";
import { normalize, type Catalog } from "../data";
import { LOCATION_TYPE, dimension, label } from "../labels";
import type { Selected } from "../useUrlState";
import { Faces } from "./EpisodesView";

interface Props {
  catalog: Catalog;
  onOpen: (selected: Selected) => void;
}

const number = new Intl.NumberFormat("pt-BR");

/** Planetas, dimensões e demais lugares da série, dos mais habitados aos vazios. */
export function LocationsView({ catalog, onOpen }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of catalog.locationList) counts.set(l.type || "unknown", (counts.get(l.type || "unknown") ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [catalog]);

  const locations = useMemo(() => {
    const q = normalize(query);
    return catalog.locationList
      .filter((l) => (!q || normalize(l.name).includes(q)) && (!type || (l.type || "unknown") === type))
      .sort((a, b) => b.residents.length - a.residents.length || a.name.localeCompare(b.name));
  }, [catalog, query, type]);

  return (
    <>
      <div className="toolbar toolbar-two" role="search">
        <label className="search">
          <span className="sr-only">Buscar local pelo nome</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input type="search" placeholder="Buscar local" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        </label>
        <label className="select">
          <span className="sr-only">Tipo de local</span>
          <select value={type} onChange={(e) => setType(e.target.value)} data-active={type !== ""}>
            <option value="">Tipo: todos</option>
            {types.map(([t, n]) => (
              <option key={t} value={t}>
                {label(LOCATION_TYPE, t)} ({n})
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="count" aria-live="polite">
        {locations.length ? `${number.format(locations.length)} ${locations.length === 1 ? "local" : "locais"}` : ""}
      </p>
      {locations.length === 0 && (
        <div className="empty">
          <h2>Nenhum local encontrado</h2>
          <p>Tente outro nome ou tipo.</p>
        </div>
      )}

      <ul className="locations">
        {locations.map((l) => (
          <li key={l.id}>
            <button type="button" className="location" onClick={() => onOpen({ kind: "local", id: l.id })}>
              <span className="location-type">{label(LOCATION_TYPE, l.type || "unknown")}</span>
              <h3>{l.name}</h3>
              <p className="muted">{dimension(l.dimension)}</p>
              {l.residents.length > 0 ? (
                <Faces ids={l.residents} total={l.residents.length} catalog={catalog} />
              ) : (
                <span className="muted location-empty">Sem moradores conhecidos</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
