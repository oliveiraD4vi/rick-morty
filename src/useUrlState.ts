import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_FILTERS, type Filters } from "./data";

// Seção, filtros e detalhe aberto ficam na URL para o link ser compartilhável.

export type Tab = "personagens" | "episodios" | "locais" | "quiz";
export type Kind = "personagem" | "episodio" | "local";
export interface Selected {
  kind: Kind;
  id: number;
}

const TABS: Tab[] = ["personagens", "episodios", "locais", "quiz"];
const KINDS: Kind[] = ["personagem", "episodio", "local"];
const KEYS: Record<keyof Filters, string> = { name: "busca", status: "status", species: "especie", gender: "genero" };

interface UrlState {
  tab: Tab;
  filters: Filters;
  selected: Selected | null;
}

function read(): UrlState {
  const params = new URLSearchParams(location.search);
  const tab = TABS.find((t) => t === params.get("aba")) ?? "personagens";
  const filters = { ...EMPTY_FILTERS };
  for (const [field, key] of Object.entries(KEYS) as [keyof Filters, string][]) filters[field] = params.get(key) ?? "";
  let selected: Selected | null = null;
  for (const kind of KINDS) {
    const id = Number(params.get(kind));
    if (Number.isInteger(id) && id > 0) selected = { kind, id };
  }
  return { tab, filters, selected };
}

function toUrl({ tab, filters, selected }: UrlState) {
  const params = new URLSearchParams();
  // O idioma vindo do portfólio (?lang=) acompanha a navegação.
  const lang = new URLSearchParams(location.search).get("lang");
  if (lang) params.set("lang", lang);
  if (tab !== "personagens") params.set("aba", tab);
  for (const [field, key] of Object.entries(KEYS) as [keyof Filters, string][]) if (filters[field]) params.set(key, filters[field]);
  if (selected) params.set(selected.kind, String(selected.id));
  return `${location.pathname}${params.size ? `?${params}` : ""}`;
}

/** Quantos detalhes foram abertos em sequência a partir da página (fica no history.state). */
const depth = (): number => (typeof history.state?.depth === "number" ? history.state.depth : 0);

export function useUrlState() {
  const [state, setStateRaw] = useState(read);
  // O histórico é atualizado fora dos "updaters" do React, que podem rodar duas vezes em desenvolvimento.
  const current = useRef(state);
  const setState = useCallback((next: UrlState) => {
    current.current = next;
    setStateRaw(next);
  }, []);

  useEffect(() => {
    // Os detalhes abrem num diálogo, sem mexer na rolagem da página; o navegador não deve
    // tentar restaurá-la ao voltar no histórico.
    history.scrollRestoration = "manual";
    const onPop = () => {
      const next = read();
      // Mantém o mesmo objeto de filtros quando nada mudou, para a lista não ser refeita.
      const prev = current.current.filters;
      if (JSON.stringify(prev) === JSON.stringify(next.filters)) next.filters = prev;
      setState(next);
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [setState]);

  /** Troca seção ou filtros sem criar entrada no histórico. */
  const update = useCallback((patch: Partial<Pick<UrlState, "tab" | "filters">>) => {
    const next = { ...current.current, ...patch };
    history.replaceState(history.state, "", toUrl(next));
    setState(next);
  }, [setState]);

  /** Abrir um detalhe (inclusive a partir de outro) cria uma entrada: o "voltar" volta ao anterior. */
  const open = useCallback((selected: Selected) => {
    const next = { ...current.current, selected };
    history.pushState({ depth: depth() + 1 }, "", toUrl(next));
    setState(next);
  }, [setState]);

  /** Fechar desfaz todos os detalhes abertos em sequência; o popstate atualiza o estado. */
  const close = useCallback(() => {
    const steps = depth();
    if (steps > 0) {
      history.go(-steps);
      return;
    }
    const next = { ...current.current, selected: null };
    history.replaceState(null, "", toUrl(next));
    setState(next);
  }, [setState]);

  const setTab = useCallback((tab: Tab) => update({ tab }), [update]);
  const setFilters = useCallback((filters: Filters) => update({ filters }), [update]);

  return { ...state, setTab, setFilters, open, close };
}
