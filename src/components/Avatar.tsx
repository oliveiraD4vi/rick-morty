import { useEffect, useState } from "react";
import { avatarUrl } from "../data";

interface Props {
  id: number;
  name: string;
  size: number;
  alt?: string;
  lazy?: boolean;
}

const RETRIES = 2;

/** Imagem do personagem com nova tentativa e um marcador com as iniciais se ela não carregar. */
export function Avatar({ id, name, size, alt = "", lazy = true }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
    setLoaded(false);
  }, [id]);

  if (failed) {
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
    return (
      <div className="avatar-fallback" role={alt ? "img" : undefined} aria-label={alt || undefined}>
        {initials}
      </div>
    );
  }

  return (
    <img
      key={attempt}
      src={attempt ? `${avatarUrl(id)}?t=${attempt}` : avatarUrl(id)}
      alt={alt}
      width={size}
      height={size}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      data-loaded={loaded}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (attempt < RETRIES) setTimeout(() => setAttempt((a) => a + 1), 1500 * (attempt + 1));
        else setFailed(true);
      }}
    />
  );
}
