// Cliente da Rick and Morty API (https://rickandmortyapi.com).

const BASE = "https://rickandmortyapi.com/api";

export type Status = "Alive" | "Dead" | "unknown";
export type Gender = "Female" | "Male" | "Genderless" | "unknown";

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  type: string;
  gender: Gender;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
}

export interface Filters {
  name: string;
  status: string;
  species: string;
  gender: string;
}

export interface Page {
  count: number;
  pages: number;
  results: Character[];
}

export const EMPTY_FILTERS: Filters = { name: "", status: "", species: "", gender: "" };

export async function fetchCharacters(filters: Filters, page: number, signal?: AbortSignal): Promise<Page> {
  const params = new URLSearchParams({ page: String(page) });
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
  const res = await fetch(`${BASE}/character?${params}`, { signal });
  // A API responde 404 quando a busca não encontra ninguém.
  if (res.status === 404) return { count: 0, pages: 0, results: [] };
  if (!res.ok) throw new Error(`A API respondeu ${res.status}`);
  const data = await res.json();
  return { count: data.info.count, pages: data.info.pages, results: data.results };
}

export async function fetchCharacter(id: number, signal?: AbortSignal): Promise<Character> {
  const res = await fetch(`${BASE}/character/${id}`, { signal });
  if (!res.ok) throw new Error(`A API respondeu ${res.status}`);
  return res.json();
}

export async function fetchEpisodes(urls: string[], signal?: AbortSignal): Promise<Episode[]> {
  if (urls.length === 0) return [];
  const ids = urls.map((u) => u.split("/").pop()).join(",");
  const res = await fetch(`${BASE}/episode/${ids}`, { signal });
  if (!res.ok) throw new Error(`A API respondeu ${res.status}`);
  const data = await res.json();
  // Com um único id a API devolve um objeto em vez de uma lista.
  return Array.isArray(data) ? data : [data];
}
