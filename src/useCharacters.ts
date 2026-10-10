import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCharacters, type Character, type Filters } from "./api";

interface State {
  items: Character[];
  count: number;
  pages: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const INITIAL: State = { items: [], count: 0, pages: 0, page: 0, loading: true, error: null };

/** Lista paginada de personagens: recomeça quando os filtros mudam e acumula as páginas seguintes. */
export function useCharacters(filters: Filters) {
  const [state, setState] = useState<State>(INITIAL);
  const controller = useRef<AbortController | null>(null);

  const load = useCallback(
    async (page: number) => {
      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;
      setState((s) => ({ ...(page === 1 ? INITIAL : s), loading: true, error: null }));
      try {
        const data = await fetchCharacters(filters, page, ctrl.signal);
        setState((s) => {
          const base = page === 1 ? [] : s.items;
          const seen = new Set(base.map((c) => c.id));
          return {
            items: [...base, ...data.results.filter((c) => !seen.has(c.id))],
            count: data.count,
            pages: data.pages,
            page,
            loading: false,
            error: null,
          };
        });
      } catch (err) {
        if (ctrl.signal.aborted) return;
        setState((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : "Erro desconhecido" }));
      }
    },
    [filters],
  );

  useEffect(() => {
    load(1);
    return () => controller.current?.abort();
  }, [load]);

  const hasMore = state.page < state.pages;
  const loadMore = useCallback(() => {
    if (!state.loading && hasMore) load(state.page + 1);
  }, [state.loading, state.page, hasMore, load]);
  const retry = useCallback(() => load(Math.max(1, state.page + (state.items.length ? 1 : 0))), [load, state.page, state.items.length]);

  return { ...state, hasMore, loadMore, retry };
}
