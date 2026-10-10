import { useCallback, useEffect, useMemo, useState } from "react";
import { filterCharacters, loadCatalog, type Catalog, type Filters } from "./data";

const PAGE = 24;

/** Lista filtrada a partir da cópia local, exibida aos poucos conforme a rolagem. */
export function useCharacters(filters: Filters) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  const load = useCallback(() => {
    setError(null);
    loadCatalog().then(setCatalog, () => setError("load"));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  // Compara pelos valores: abrir e fechar um detalhe relê a URL e gera outro objeto com os mesmos
  // filtros, e voltar a 24 itens nessa hora encolhia a página e jogava a rolagem para o fim.
  const key = JSON.stringify(filters);
  const matches = useMemo(() => (catalog ? filterCharacters(catalog.characters, filters) : []), [catalog, key]);
  useEffect(() => {
    setVisible(PAGE);
  }, [key]);

  const hasMore = visible < matches.length;
  const loadMore = useCallback(() => setVisible((v) => v + PAGE), []);

  return {
    catalog,
    items: matches.slice(0, visible),
    count: matches.length,
    loading: !catalog && !error,
    error,
    hasMore,
    loadMore,
    retry: load,
  };
}
