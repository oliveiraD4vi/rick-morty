import { useCallback, useState } from "react";
import { avatarUrl } from "../data";

interface Props {
  id: number;
  name: string;
  size: number;
  alt?: string;
  lazy?: boolean;
}

const RETRIES = 2;

/**
 * Imagem do personagem com nova tentativa e um marcador com as iniciais se ela não carregar.
 * Quem usa deve passar `key={id}` ao trocar de personagem no mesmo lugar.
 */
export function Avatar({ id, name, size, alt = "", lazy = true }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const src = attempt ? `${avatarUrl(id)}?t=${attempt}` : avatarUrl(id);
  // O estado guarda qual endereço terminou de carregar. Imagens em cache podem disparar o "load"
  // antes do React ligar o evento, então a ref também confere `complete`.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) setLoadedSrc(src);
    },
    [src],
  );

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
      key={src}
      ref={ref}
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      data-loaded={loadedSrc === src}
      onLoad={() => setLoadedSrc(src)}
      onError={() => {
        if (attempt < RETRIES) setTimeout(() => setAttempt((a) => a + 1), 1500 * (attempt + 1));
        else setFailed(true);
      }}
    />
  );
}
