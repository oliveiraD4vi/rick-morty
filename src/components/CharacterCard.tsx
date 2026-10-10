import type { Character } from "../data";
import { GENDER, SPECIES, STATUS, label, place } from "../labels";
import { Avatar } from "./Avatar";

interface Props {
  character: Character;
  onOpen: (id: number) => void;
}

export function CharacterCard({ character: c, onOpen }: Props) {
  return (
    <li className="card">
      <button type="button" className="card-button" onClick={() => onOpen(c.id)} aria-label={`Ver detalhes de ${c.name}`}>
        <div className="card-image">
          <Avatar id={c.id} name={c.name} size={300} />
          <span className={`status status-${c.status.toLowerCase()}`}>{label(STATUS, c.status)}</span>
        </div>
        <div className="card-body">
          <h3>{c.name}</h3>
          <p className="card-meta">
            {label(SPECIES, c.species)} · {label(GENDER, c.gender)}
          </p>
          <dl>
            <div>
              <dt>Última localização</dt>
              <dd>{place(c.location.name)}</dd>
            </div>
            <div>
              <dt>Episódios</dt>
              <dd>{c.episodes.length}</dd>
            </div>
          </dl>
        </div>
      </button>
    </li>
  );
}

export function CardSkeleton() {
  return (
    <li className="card card-skeleton" aria-hidden="true">
      <div className="card-image" />
      <div className="card-body">
        <span />
        <span />
        <span />
      </div>
    </li>
  );
}
