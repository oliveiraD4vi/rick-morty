import { useEffect, useRef } from "react";
import type { Catalog } from "../data";
import { GENDER, SPECIES, STATUS, label, place } from "../labels";
import { Avatar } from "./Avatar";

interface Props {
  id: number;
  catalog: Catalog;
  onClose: () => void;
}

export function CharacterDialog({ id, catalog, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const character = catalog.byId.get(id);
  const episodes = character?.episodes.flatMap((e) => catalog.episodes.get(e) ?? []) ?? [];

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

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

        {!character ? (
          <p className="dialog-loading" id="dialog-title">
            Personagem não encontrado.
          </p>
        ) : (
          <>
            <header className="dialog-head">
              <div className="dialog-image">
                <Avatar id={character.id} name={character.name} size={300} alt={character.name} lazy={false} />
              </div>
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
                    <dd>{place(character.origin)}</dd>
                  </div>
                  <div>
                    <dt>Última localização</dt>
                    <dd>{place(character.location)}</dd>
                  </div>
                </dl>
              </div>
            </header>

            <section className="episodes" aria-labelledby="episodes-title">
              <h3 id="episodes-title">
                Episódios <span>{episodes.length}</span>
              </h3>
              <ol>
                {episodes.map((ep) => (
                  <li key={ep.id}>
                    <code>{ep.code}</code>
                    <span>{ep.name}</span>
                    <time>{formatDate(ep.air_date)}</time>
                  </li>
                ))}
              </ol>
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
