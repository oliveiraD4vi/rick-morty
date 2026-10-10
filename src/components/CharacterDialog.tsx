import { useEffect, useRef, useState } from "react";
import { fetchCharacter, fetchEpisodes, type Character, type Episode } from "../api";
import { GENDER, SPECIES, STATUS, label, place } from "../labels";

interface Props {
  id: number;
  /** Personagem já carregado na lista, para abrir sem esperar a API. */
  initial?: Character;
  onClose: () => void;
}

export function CharacterDialog({ id, initial, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [character, setCharacter] = useState<Character | null>(initial ?? null);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setError(null);
    setEpisodes(null);
    (async () => {
      try {
        const c = initial?.id === id ? initial : await fetchCharacter(id, ctrl.signal);
        setCharacter(c);
        setEpisodes(await fetchEpisodes(c.episode, ctrl.signal));
      } catch (err) {
        if (!ctrl.signal.aborted) setError(err instanceof Error ? err.message : "Erro desconhecido");
      }
    })();
    return () => ctrl.abort();
  }, [id, initial]);

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
      <div className="dialog-content">
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {!character && !error && <p className="dialog-loading">Carregando…</p>}
        {error && !character && <p className="dialog-loading">Não foi possível carregar o personagem.</p>}

        {character && (
          <>
            <header className="dialog-head">
              <img src={character.image} alt={character.name} width="300" height="300" />
              <div>
                <span className={`status status-${character.status.toLowerCase()}`}>{label(STATUS, character.status)}</span>
                <h2 id="dialog-title">{character.name}</h2>
                <dl className="facts">
                  <div>
                    <dt>Espécie</dt>
                    <dd>
                      {label(SPECIES, character.species)}
                      {character.type && ` (${character.type})`}
                    </dd>
                  </div>
                  <div>
                    <dt>Gênero</dt>
                    <dd>{label(GENDER, character.gender)}</dd>
                  </div>
                  <div>
                    <dt>Origem</dt>
                    <dd>{place(character.origin.name)}</dd>
                  </div>
                  <div>
                    <dt>Última localização</dt>
                    <dd>{place(character.location.name)}</dd>
                  </div>
                </dl>
              </div>
            </header>

            <section className="episodes" aria-labelledby="episodes-title">
              <h3 id="episodes-title">
                Episódios <span>{character.episode.length}</span>
              </h3>
              {error && <p className="muted">Não foi possível carregar os episódios.</p>}
              {!episodes && !error && <p className="muted">Carregando episódios…</p>}
              {episodes && (
                <ol>
                  {episodes.map((ep) => (
                    <li key={ep.id}>
                      <code>{ep.episode}</code>
                      <span>{ep.name}</span>
                      <time>{formatDate(ep.air_date)}</time>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </div>
    </dialog>
  );
}

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
}
