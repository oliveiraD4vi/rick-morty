import { useMemo, useState } from "react";
import { seasonOf, type Catalog } from "../data";
import type { Selected } from "../useUrlState";
import { Avatar } from "./Avatar";
import { EpisodeRow } from "./DetailDialog";

interface Props {
  catalog: Catalog;
  onOpen: (selected: Selected) => void;
}

/** Episódios agrupados por temporada, com o elenco de cada um. */
export function EpisodesView({ catalog, onOpen }: Props) {
  const seasons = useMemo(() => {
    const map = new Map<number, typeof catalog.episodeList>();
    for (const ep of catalog.episodeList) {
      const season = seasonOf(ep.code);
      map.set(season, [...(map.get(season) ?? []), ep]);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [catalog]);
  const [season, setSeason] = useState<number | null>(null);

  return (
    <>
      <div className="chips" role="group" aria-label="Temporada">
        <button type="button" aria-pressed={season === null} onClick={() => setSeason(null)}>
          Todas
        </button>
        {seasons.map(([n]) => (
          <button key={n} type="button" aria-pressed={season === n} onClick={() => setSeason(n)}>
            Temporada {n}
          </button>
        ))}
      </div>

      {seasons
        .filter(([n]) => season === null || season === n)
        .map(([n, episodes]) => (
          <section key={n} className="season" aria-labelledby={`season-${n}`}>
            <h2 id={`season-${n}`}>
              Temporada {n} <span>{episodes.length} episódios</span>
            </h2>
            <ol className="episode-list">
              {episodes.map((ep) => (
                <li key={ep.id}>
                  <EpisodeRow
                    episode={ep}
                    onOpen={onOpen}
                    extra={<Faces ids={ep.characters} total={ep.characters.length} catalog={catalog} />}
                  />
                </li>
              ))}
            </ol>
          </section>
        ))}
    </>
  );
}

/** Alguns rostos e o total, para dar uma ideia do elenco. */
export function Faces({ ids, total, catalog }: { ids: number[]; total: number; catalog: Catalog }) {
  const shown = ids.slice(0, 4).flatMap((id) => catalog.byId.get(id) ?? []);
  return (
    <span className="faces" aria-label={`${total} personagens`}>
      {shown.map((c) => (
        <span key={c.id} className="face">
          <Avatar key={c.id} id={c.id} name={c.name} size={40} />
        </span>
      ))}
      <span className="faces-count">{total}</span>
    </span>
  );
}
