import { useEffect, useRef } from "react";
import { CardSkeleton, CharacterCard } from "./components/CharacterCard";
import { DetailDialog } from "./components/DetailDialog";
import { EpisodesView } from "./components/EpisodesView";
import { LocationsView } from "./components/LocationsView";
import { Toolbar } from "./components/Toolbar";
import { useCharacters } from "./useCharacters";
import { useUrlState, type Tab } from "./useUrlState";

const number = new Intl.NumberFormat("pt-BR");

const TABS: { id: Tab; label: string }[] = [
  { id: "personagens", label: "Personagens" },
  { id: "episodios", label: "Episódios" },
  { id: "locais", label: "Locais" },
];

export function App() {
  const { tab, filters, selected, setTab, setFilters, open, close } = useUrlState();
  const { catalog, items, count, loading, error, hasMore, loadMore, retry } = useCharacters(filters);

  // Carrega mais personagens quando o fim da lista aparece na tela.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore || tab !== "personagens") return;
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "800px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore, tab]);

  const totals = catalog && {
    personagens: catalog.characters.length,
    episodios: catalog.episodeList.length,
    locais: catalog.locationList.length,
  };

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <p className="eyebrow">Guia da série</p>
          <h1>Rick and Morty</h1>
          <p className="lead">
            Personagens, episódios e lugares da série, todos ligados entre si: veja quem aparece em cada episódio e quem
            mora em cada planeta. Dados da{" "}
            <a href="https://rickandmortyapi.com" target="_blank" rel="noopener">
              Rick and Morty API
            </a>
            .
          </p>
        </div>
      </header>

      <div className="sticky">
        <div className="wrap">
          <nav className="tabs" aria-label="Seções">
            {TABS.map((t) => (
              <button key={t.id} type="button" aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
                {t.label}
                {totals && <span>{number.format(totals[t.id])}</span>}
              </button>
            ))}
          </nav>
          {tab === "personagens" && <Toolbar filters={filters} onChange={setFilters} />}
        </div>
      </div>

      <main className="wrap" id="conteudo">
        {error && (
          <div className="empty">
            <h2>Não foi possível carregar</h2>
            <p>{error}</p>
            <button type="button" className="button" onClick={retry}>
              Tentar de novo
            </button>
          </div>
        )}

        {tab === "personagens" && (
          <>
            <p className="count" aria-live="polite">
              {loading ? "Carregando personagens…" : count > 0 ? `${number.format(count)} ${count === 1 ? "personagem" : "personagens"}` : ""}
            </p>
            {!loading && !error && count === 0 && (
              <div className="empty">
                <h2>Nenhum personagem encontrado</h2>
                <p>Tente outro nome ou remova algum filtro.</p>
              </div>
            )}
            <ul className="grid">
              {items.map((c) => (
                <CharacterCard key={c.id} character={c} onOpen={(id) => open({ kind: "personagem", id })} />
              ))}
              {loading && Array.from({ length: 12 }, (_, i) => <CardSkeleton key={`s${i}`} />)}
            </ul>
            <div ref={sentinel} />
            {hasMore && (
              <div className="more">
                <button type="button" className="button" onClick={loadMore}>
                  Carregar mais
                </button>
              </div>
            )}
          </>
        )}

        {tab === "episodios" && catalog && <EpisodesView catalog={catalog} onOpen={open} />}
        {tab === "locais" && catalog && <LocationsView catalog={catalog} onOpen={open} />}
        {tab !== "personagens" && loading && <p className="count">Carregando…</p>}
      </main>

      <footer className="footer">
        <div className="wrap">
          Feito por{" "}
          <a href="https://coaladev.com.br" target="_blank" rel="noopener">
            Davi Oliveira
          </a>{" "}
          ·{" "}
          <a href="https://github.com/oliveiraD4vi/rick-morty" target="_blank" rel="noopener">
            Código no GitHub
          </a>
        </div>
      </footer>

      {selected && catalog && <DetailDialog selected={selected} catalog={catalog} onOpen={open} onClose={close} />}
    </>
  );
}
