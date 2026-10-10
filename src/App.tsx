import { useEffect, useMemo, useRef, useState } from "react";
import { CardSkeleton, CharacterCard } from "./components/CharacterCard";
import { DetailDialog } from "./components/DetailDialog";
import { EpisodesView } from "./components/EpisodesView";
import { LocationsView } from "./components/LocationsView";
import { Toolbar } from "./components/Toolbar";
import { I18nContext, STRINGS, initialLang, makeLabels, saveLang, type Lang } from "./i18n";
import { useCharacters } from "./useCharacters";
import { useUrlState, type Tab } from "./useUrlState";

const TABS: Tab[] = ["personagens", "episodios", "locais"];

export function App() {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const i18n = useMemo(
    () => ({
      lang,
      t: STRINGS[lang],
      l: makeLabels(lang),
      setLang: (next: Lang) => {
        saveLang(next);
        setLangState(next);
        // Mantém a URL coerente quando a página veio com ?lang= do portfólio.
        const url = new URL(location.href);
        if (url.searchParams.has("lang")) {
          url.searchParams.set("lang", next);
          history.replaceState(history.state, "", url);
        }
      },
    }),
    [lang],
  );
  const { t, l } = i18n;
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = t.title;
  }, [lang, t]);

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
    <I18nContext.Provider value={i18n}>
      <header className="top wrap">
        <span className="brand">
          <span className="portal" aria-hidden="true" />
          Rick and Morty
        </span>
        <div className="lang" role="group" aria-label={t.language}>
          {(["pt", "en"] as Lang[]).map((code) => (
            <button key={code} type="button" aria-pressed={lang === code} onClick={() => i18n.setLang(code)} lang={code === "pt" ? "pt-BR" : "en"}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>Rick and Morty</h1>
          <p className="lead">
            {t.lead}{" "}
            <a href="https://rickandmortyapi.com" target="_blank" rel="noopener">
              Rick and Morty API
            </a>
            .
          </p>
        </div>
      </section>

      <div className="sticky">
        <div className="wrap">
          <nav className="tabs" aria-label={t.sections}>
            {TABS.map((id) => (
              <button key={id} type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)}>
                {t.tabs[id]}
                {totals && <span>{l.number(totals[id])}</span>}
              </button>
            ))}
          </nav>
          {tab === "personagens" && <Toolbar filters={filters} onChange={setFilters} />}
        </div>
      </div>

      <main className="wrap" id="conteudo">
        {error && (
          <div className="empty">
            <h2>{t.loadError}</h2>
            <p>{t.loadErrorHint}</p>
            <button type="button" className="button" onClick={retry}>
              {t.retry}
            </button>
          </div>
        )}

        {tab === "personagens" && (
          <>
            <p className="count" aria-live="polite">
              {loading ? t.loadingCharacters : count > 0 ? t.characters(l.number(count), count) : ""}
            </p>
            {!loading && !error && count === 0 && (
              <div className="empty">
                <h2>{t.noCharacters}</h2>
                <p>{t.noCharactersHint}</p>
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
                  {t.loadMore}
                </button>
              </div>
            )}
          </>
        )}

        {tab === "episodios" && catalog && <EpisodesView catalog={catalog} onOpen={open} />}
        {tab === "locais" && catalog && <LocationsView catalog={catalog} onOpen={open} />}
        {tab !== "personagens" && loading && <p className="count">{t.loading}</p>}
      </main>

      <footer className="footer">
        <div className="wrap">
          {t.madeBy}{" "}
          <a href={lang === "pt" ? "https://coaladev.com.br" : "https://coaladev.com.br/en/"} target="_blank" rel="noopener">
            Davi Oliveira
          </a>{" "}
          ·{" "}
          <a href="https://github.com/oliveiraD4vi/rick-morty" target="_blank" rel="noopener">
            {t.code}
          </a>
        </div>
      </footer>

      {selected && catalog && <DetailDialog selected={selected} catalog={catalog} onOpen={open} onClose={close} />}
    </I18nContext.Provider>
  );
}
