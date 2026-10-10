// Dados dos personagens, episódios e locais.
// Vêm de uma cópia da Rick and Morty API (src/data/snapshot.json, gerada por `npm run snapshot`),
// então busca, filtros e paginação não dependem da API nem esbarram no limite de requisições dela.

export type Status = "Alive" | "Dead" | "unknown";
export type Gender = "Female" | "Male" | "Genderless" | "unknown";

export interface Place {
  name: string;
  /** null quando a API não sabe o lugar ("unknown"). */
  id: number | null;
}

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  type: string;
  gender: Gender;
  origin: Place;
  location: Place;
  episodes: number[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  code: string;
  characters: number[];
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: number[];
}

export interface Filters {
  name: string;
  status: string;
  species: string;
  gender: string;
}

export interface Catalog {
  characters: Character[];
  byId: Map<number, Character>;
  episodeList: Episode[];
  episodes: Map<number, Episode>;
  locationList: Location[];
  locations: Map<number, Location>;
}

export const EMPTY_FILTERS: Filters = { name: "", status: "", species: "", gender: "" };

let catalog: Promise<Catalog> | null = null;

/** Carrega a cópia local uma única vez (fica num arquivo separado do bundle principal). */
export function loadCatalog(): Promise<Catalog> {
  catalog ??= import("./data/snapshot.json").then(({ default: data }) => {
    const characters = data.characters as Character[];
    const episodeList = data.episodes as Episode[];
    const locationList = data.locations as Location[];
    return {
      characters,
      byId: new Map(characters.map((c) => [c.id, c])),
      episodeList,
      episodes: new Map(episodeList.map((e) => [e.id, e])),
      locationList,
      locations: new Map(locationList.map((l) => [l.id, l])),
    };
  });
  return catalog;
}

/** Imagens passam pelo nosso servidor, que guarda uma cópia (veja o nginx em coaladev.com.br). */
export const avatarUrl = (id: number) => `/avatar/${id}.jpeg`;

export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export function filterCharacters(characters: Character[], filters: Filters): Character[] {
  const name = normalize(filters.name);
  return characters.filter(
    (c) =>
      (!name || normalize(c.name).includes(name)) &&
      (!filters.status || c.status === filters.status) &&
      (!filters.species || c.species === filters.species) &&
      (!filters.gender || c.gender === filters.gender),
  );
}

/** "S02E05" -> 2 */
export const seasonOf = (code: string) => Number(code.slice(1, 3));
