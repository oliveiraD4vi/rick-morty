import { useCallback, useEffect, useState } from "react";
import { EMPTY_FILTERS, type Filters } from "./api";

// Filtros e personagem aberto ficam na URL para o link ser compartilhável.
const KEYS: Record<keyof Filters, string> = { name: "busca", status: "status", species: "especie", gender: "genero" };
const SELECTED = "personagem";

function read() {
  const params = new URLSearchParams(location.search);
  const filters = { ...EMPTY_FILTERS };
  for (const [field, key] of Object.entries(KEYS) as [keyof Filters, string][]) filters[field] = params.get(key) ?? "";
  const id = Number(params.get(SELECTED));
  return { filters, selected: Number.isInteger(id) && id > 0 ? id : null };
}

function write(filters: Filters, selected: number | null, push: boolean) {
  const params = new URLSearchParams();
  for (const [field, key] of Object.entries(KEYS) as [keyof Filters, string][]) if (filters[field]) params.set(key, filters[field]);
  if (selected) params.set(SELECTED, String(selected));
  const url = `${location.pathname}${params.size ? `?${params}` : ""}`;
  if (url === `${location.pathname}${location.search}`) return;
  if (push) history.pushState({ opened: true }, "", url);
  else history.replaceState(history.state, "", url);
}

export function useUrlState() {
  const [state, setState] = useState(read);

  useEffect(() => {
    const onPop = () => setState(read());
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  const setFilters = useCallback((filters: Filters) => {
    setState((s) => {
      write(filters, s.selected, false);
      return { ...s, filters };
    });
  }, []);

  // Abrir um personagem cria uma entrada no histórico: o "voltar" do celular fecha o detalhe.
  const setSelected = useCallback((selected: number | null) => {
    // Fechar o detalhe aberto por nós desfaz a entrada no histórico; o popstate atualiza o estado.
    if (selected === null && history.state?.opened) {
      history.back();
      return;
    }
    setState((s) => {
      write(s.filters, selected, selected !== null);
      return { ...s, selected };
    });
  }, []);

  return { ...state, setFilters, setSelected };
}
