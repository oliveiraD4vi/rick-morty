import { useEffect, useRef } from "react";
import { seasonOf, type Catalog, type Character, type Episode, type Location, type Place } from "../data";
import { GENDER, LOCATION_TYPE, SPECIES, STATUS, dimension, label, place } from "../labels";
import type { Selected } from "../useUrlState";
import { Avatar } from "./Avatar";

interface Props {
  selected: Selected;
  catalog: Catalog;
  onOpen: (selected: Selected) => void;
  onClose: () => void;
}

/** Detalhe de um personagem, episódio ou local. Tudo dentro dele leva aos outros. */
export function DetailDialog({ selected, catalog, onOpen, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);
  // Ao navegar de um detalhe para outro, volta ao topo. (Chaves de propósito: scrollTo pode
  // devolver uma Promise, e o React trataria o retorno do efeito como função de limpeza.)
  useEffect(() => {
    content.current?.scrollTo(0, 0);
  }, [selected.kind, selected.id]);

  let body;
  if (selected.kind === "personagem") {
    const c = catalog.byId.get(selected.id);
    body = c && <CharacterDetail character={c} catalog={catalog} onOpen={onOpen} />;
  } else if (selected.kind === "episodio") {
    const e = catalog.episodes.get(selected.id);
    body = e && <EpisodeDetail episode={e} catalog={catalog} onOpen={onOpen} />;
  } else {
    const l = catalog.locations.get(selected.id);
    body = l && <LocationDetail location={l} catalog={catalog} onOpen={onOpen} />;
  }

  return (
    <dialog
      ref={dialog}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clique fora do conteúdo (no fundo escurecido) fecha.
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="dialog-content" ref={content}>
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {body ?? (
          <p className="dialog-loading" id="dialog-title">
            Não encontrado.
          </p>
        )}
      </div>
    </dialog>
  );
}

type DetailProps = { catalog: Catalog; onOpen: (selected: Selected) => void };

function CharacterDetail({ character: c, catalog, onOpen }: DetailProps & { character: Character }) {
  const episodes = c.episodes.flatMap((id) => catalog.episodes.get(id) ?? []);
  return (
    <>
      <header className="dialog-head">
        <div className="dialog-image">
          <Avatar key={c.id} id={c.id} name={c.name} size={300} alt={c.name} lazy={false} />
        </div>
        <div>
          <span className={`status status-${c.status.toLowerCase()}`}>{label(STATUS, c.status)}</span>
          <h2 id="dialog-title">{c.name}</h2>
          <dl className="facts">
            <Fact term="Espécie">
              {label(SPECIES, c.species)}
              {c.type && ` (${c.type})`}
            </Fact>
            <Fact term="Gênero">{label(GENDER, c.gender)}</Fact>
            <Fact term="Origem">
              <PlaceLink place={c.origin} onOpen={onOpen} />
            </Fact>
            <Fact term="Última localização">
              <PlaceLink place={c.location} onOpen={onOpen} />
            </Fact>
          </dl>
        </div>
      </header>

      <section className="related" aria-labelledby="related-title">
        <h3 id="related-title">
          Episódios <span>{episodes.length}</span>
        </h3>
        <ol className="episode-list">
          {episodes.map((ep) => (
            <li key={ep.id}>
              <EpisodeRow episode={ep} onOpen={onOpen} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function EpisodeDetail({ episode: e, catalog, onOpen }: DetailProps & { episode: Episode }) {
  const cast = e.characters.flatMap((id) => catalog.byId.get(id) ?? []);
  return (
    <>
      <header className="dialog-text-head">
        <p className="eyebrow">
          Temporada {seasonOf(e.code)} · {e.code}
        </p>
        <h2 id="dialog-title">{e.name}</h2>
        <p className="muted">Exibido em {formatDate(e.air_date, "long")}</p>
      </header>
      <section className="related" aria-labelledby="related-title">
        <h3 id="related-title">
          Personagens no episódio <span>{cast.length}</span>
        </h3>
        <People people={cast} onOpen={onOpen} />
      </section>
    </>
  );
}

function LocationDetail({ location: l, catalog, onOpen }: DetailProps & { location: Location }) {
  const residents = l.residents.flatMap((id) => catalog.byId.get(id) ?? []);
  return (
    <>
      <header className="dialog-text-head">
        <p className="eyebrow">{label(LOCATION_TYPE, l.type || "unknown")}</p>
        <h2 id="dialog-title">{l.name}</h2>
        <p className="muted">{dimension(l.dimension)}</p>
      </header>
      <section className="related" aria-labelledby="related-title">
        <h3 id="related-title">
          Moradores <span>{residents.length}</span>
        </h3>
        {residents.length ? <People people={residents} onOpen={onOpen} /> : <p className="muted">Ninguém mora aqui.</p>}
      </section>
    </>
  );
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function PlaceLink({ place: p, onOpen }: { place: Place; onOpen: DetailProps["onOpen"] }) {
  if (p.id === null) return <>{place(p.name)}</>;
  const id = p.id;
  return (
    <button type="button" className="link" onClick={() => onOpen({ kind: "local", id })}>
      {p.name}
    </button>
  );
}

export function EpisodeRow({ episode: ep, onOpen, extra }: { episode: Episode; onOpen: DetailProps["onOpen"]; extra?: React.ReactNode }) {
  return (
    <button type="button" className="episode-row" onClick={() => onOpen({ kind: "episodio", id: ep.id })}>
      <code>{ep.code}</code>
      <span className="episode-name">{ep.name}</span>
      {extra}
      <time>{formatDate(ep.air_date)}</time>
    </button>
  );
}

function People({ people, onOpen }: { people: Character[]; onOpen: DetailProps["onOpen"] }) {
  return (
    <ul className="people">
      {people.map((c) => (
        <li key={c.id}>
          <button type="button" onClick={() => onOpen({ kind: "personagem", id: c.id })}>
            <span className="people-image">
              <Avatar key={c.id} id={c.id} name={c.name} size={120} />
            </span>
            <span className="people-name">{c.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const formats = {
  short: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
  long: new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }),
};

export function formatDate(value: string, style: keyof typeof formats = "short") {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formats[style].format(date);
}
