import { useMemo, useState } from "react";
import { normalize, type Catalog } from "../data";
import { useI18n } from "../i18n";
import type { Selected } from "../useUrlState";
import { Faces } from "./EpisodesView";

interface Props {
  catalog: Catalog;
  onOpen: (selected: Selected) => void;
}

/** Planetas, dimensões e demais lugares da série, dos mais habitados aos vazios. */
export function LocationsView({ catalog, onOpen }: Props) {
  const { t, l } = useI18n();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const loc of catalog.locationList) counts.set(loc.type || "unknown", (counts.get(loc.type || "unknown") ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [catalog]);

  const locations = useMemo(() => {
    const q = normalize(query);
    return catalog.locationList
      .filter((loc) => (!q || normalize(loc.name).includes(q)) && (!type || (loc.type || "unknown") === type))
      .sort((a, b) => b.residents.length - a.residents.length || a.name.localeCompare(b.name));
  }, [catalog, query, type]);

  return (
    <>
      <div className="toolbar toolbar-two" role="search">
        <label className="search">
          <span className="sr-only">{t.searchLocationLabel}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input type="search" placeholder={t.searchLocation} value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        </label>
        <label className="select">
          <span className="sr-only">{t.locationType}</span>
          <select value={type} onChange={(e) => setType(e.target.value)} data-active={type !== ""}>
            <option value="">{t.all(t.locationType)}</option>
            {types.map(([value, n]) => (
              <option key={value} value={value}>
                {l.label("locationType", value)} ({n})
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="count" aria-live="polite">
        {locations.length ? t.locations(l.number(locations.length), locations.length) : ""}
      </p>
      {locations.length === 0 && (
        <div className="empty">
          <h2>{t.noLocations}</h2>
          <p>{t.noLocationsHint}</p>
        </div>
      )}

      <ul className="locations">
        {locations.map((loc) => (
          <li key={loc.id}>
            <button type="button" className="location" onClick={() => onOpen({ kind: "local", id: loc.id })}>
              <span className="location-type">{l.label("locationType", loc.type || "unknown")}</span>
              <h3>{loc.name}</h3>
              <p className="muted">{l.dimension(loc.dimension)}</p>
              {loc.residents.length > 0 ? (
                <Faces ids={loc.residents} total={loc.residents.length} catalog={catalog} />
              ) : (
                <span className="muted location-empty">{t.noResidents}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
