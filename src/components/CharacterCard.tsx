import type { Character } from "../data";
import { useI18n } from "../i18n";
import { Avatar } from "./Avatar";

interface Props {
  character: Character;
  onOpen: (id: number) => void;
}

export function CharacterCard({ character: c, onOpen }: Props) {
  const { t, l } = useI18n();
  return (
    <li className="card">
      <button type="button" className="card-button" onClick={() => onOpen(c.id)} aria-label={t.details(c.name)}>
        <div className="card-image">
          <Avatar id={c.id} name={c.name} size={300} />
          <span className={`status status-${c.status.toLowerCase()}`}>{l.label("status", c.status)}</span>
        </div>
        <div className="card-body">
          <h3>{c.name}</h3>
          <p className="card-meta">
            {l.label("species", c.species)} · {l.label("gender", c.gender)}
          </p>
          <dl>
            <div>
              <dt>{t.lastLocation}</dt>
              <dd>{l.place(c.location.name)}</dd>
            </div>
            <div>
              <dt>{t.episodes}</dt>
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
