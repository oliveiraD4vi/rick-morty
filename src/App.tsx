import { useEffect, useRef } from "react";
import { CardSkeleton, CharacterCard } from "./components/CharacterCard";
import { CharacterDialog } from "./components/CharacterDialog";
import { Toolbar } from "./components/Toolbar";
import { useCharacters } from "./useCharacters";
import { useUrlState } from "./useUrlState";

const number = new Intl.NumberFormat("pt-BR");

export function App() {
  const { filters, selected, setFilters, setSelected } = useUrlState();
  const { items, count, loading, error, hasMore, loadMore, retry } = useCharacters(filters);

  // Carrega a próxima página quando o fim da lista aparece na tela.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "600px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const firstLoad = loading && items.length === 0;

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <p className="eyebrow">Guia de personagens</p>
          <h1>Rick and Morty</h1>
          <p className="lead">
            Todos os personagens da série, com busca, filtros e os episódios em que cada um aparece. Dados da{" "}
            <a href="https://rickandmortyapi.com" target="_blank" rel="noopener">
              Rick and Morty API
            </a>
            .
          </p>
        </div>
      </header>

      <div className="sticky">
        <div className="wrap">
          <Toolbar filters={filters} onChange={setFilters} />
        </div>
      </div>

      <main className="wrap" id="conteudo">
        <p className="count" aria-live="polite">
          {firstLoad ? "Buscando personagens…" : count > 0 ? `${number.format(count)} personagens` : ""}
        </p>

        {!loading && !error && count === 0 && (
          <div className="empty">
            <h2>Nenhum personagem encontrado</h2>
            <p>Tente outro nome ou remova algum filtro.</p>
          </div>
        )}

        <ul className="grid">
          {items.map((c) => (
            <CharacterCard key={c.id} character={c} onOpen={setSelected} />
          ))}
          {loading && Array.from({ length: firstLoad ? 12 : 4 }, (_, i) => <CardSkeleton key={`s${i}`} />)}
        </ul>

        {error && (
          <div className="empty">
            <h2>Não foi possível carregar</h2>
            <p>{error}</p>
            <button type="button" className="button" onClick={retry}>
              Tentar de novo
            </button>
          </div>
        )}

        <div ref={sentinel} />
        {hasMore && !loading && !error && (
          <div className="more">
            <button type="button" className="button" onClick={loadMore}>
              Carregar mais
            </button>
          </div>
        )}
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

      {selected && (
        <CharacterDialog
          key={selected}
          id={selected}
          initial={items.find((c) => c.id === selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
