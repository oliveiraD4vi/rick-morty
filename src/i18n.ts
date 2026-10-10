// Textos da interface e tradução dos valores da API, em português e inglês.
// Nomes de personagens, episódios e lugares ficam como vêm da API (são nomes próprios).
import { createContext, useContext } from "react";

export type Lang = "pt" | "en";

const pt = {
  eyebrow: "Guia da série",
  lead: "Personagens, episódios e lugares da série, todos ligados entre si: veja quem aparece em cada episódio e quem mora em cada planeta. Dados da",
  tabs: { personagens: "Personagens", episodios: "Episódios", locais: "Locais" },
  searchName: "Buscar pelo nome",
  searchCharacter: "Buscar personagem pelo nome",
  status: "Situação",
  species: "Espécie",
  gender: "Gênero",
  all: (label: string) => `${label}: todos`,
  clear: "Limpar",
  loadingCharacters: "Carregando personagens…",
  loading: "Carregando…",
  characters: (n: string, count: number) => `${n} ${count === 1 ? "personagem" : "personagens"}`,
  noCharacters: "Nenhum personagem encontrado",
  noCharactersHint: "Tente outro nome ou remova algum filtro.",
  loadError: "Não foi possível carregar",
  loadErrorHint: "Verifique sua conexão e tente de novo.",
  retry: "Tentar de novo",
  loadMore: "Carregar mais",
  details: (name: string) => `Ver detalhes de ${name}`,
  lastLocation: "Última localização",
  episodes: "Episódios",
  origin: "Origem",
  close: "Fechar",
  notFound: "Não encontrado.",
  season: (n: number) => `Temporada ${n}`,
  seasonFilter: "Temporada",
  allSeasons: "Todas",
  seasonEpisodes: (n: number) => `${n} episódios`,
  aired: (date: string) => `Exibido em ${date}`,
  cast: "Personagens no episódio",
  residents: "Moradores",
  nobodyLives: "Ninguém mora aqui.",
  searchLocation: "Buscar local",
  searchLocationLabel: "Buscar local pelo nome",
  locationType: "Tipo",
  locations: (n: string, count: number) => `${n} ${count === 1 ? "local" : "locais"}`,
  noLocations: "Nenhum local encontrado",
  noLocationsHint: "Tente outro nome ou tipo.",
  noResidents: "Sem moradores conhecidos",
  faces: (n: number) => `${n} personagens`,
  madeBy: "Feito por",
  code: "Código no GitHub",
  language: "Idioma",
  sections: "Seções",
  title: "Rick and Morty · Guia da série",
};

const en: typeof pt = {
  eyebrow: "Series guide",
  lead: "The show's characters, episodes and places, all linked together: see who appears in each episode and who lives on each planet. Data from the",
  tabs: { personagens: "Characters", episodios: "Episodes", locais: "Locations" },
  searchName: "Search by name",
  searchCharacter: "Search characters by name",
  status: "Status",
  species: "Species",
  gender: "Gender",
  all: (label: string) => `${label}: all`,
  clear: "Clear",
  loadingCharacters: "Loading characters…",
  loading: "Loading…",
  characters: (n: string, count: number) => `${n} ${count === 1 ? "character" : "characters"}`,
  noCharacters: "No characters found",
  noCharactersHint: "Try another name or remove a filter.",
  loadError: "Couldn't load",
  loadErrorHint: "Check your connection and try again.",
  retry: "Try again",
  loadMore: "Load more",
  details: (name: string) => `See details for ${name}`,
  lastLocation: "Last location",
  episodes: "Episodes",
  origin: "Origin",
  close: "Close",
  notFound: "Not found.",
  season: (n: number) => `Season ${n}`,
  seasonFilter: "Season",
  allSeasons: "All",
  seasonEpisodes: (n: number) => `${n} episodes`,
  aired: (date: string) => `Aired on ${date}`,
  cast: "Characters in this episode",
  residents: "Residents",
  nobodyLives: "Nobody lives here.",
  searchLocation: "Search locations",
  searchLocationLabel: "Search locations by name",
  locationType: "Type",
  locations: (n: string, count: number) => `${n} ${count === 1 ? "location" : "locations"}`,
  noLocations: "No locations found",
  noLocationsHint: "Try another name or type.",
  noResidents: "No known residents",
  faces: (n: number) => `${n} characters`,
  madeBy: "Made by",
  code: "Code on GitHub",
  language: "Language",
  sections: "Sections",
  title: "Rick and Morty · Series guide",
};

export type Strings = typeof pt;
export const STRINGS: Record<Lang, Strings> = { pt, en };

// ---------- Valores da API ----------

const LABELS = {
  pt: {
    status: { Alive: "Vivo", Dead: "Morto", unknown: "Desconhecido" } as Record<string, string>,
    gender: { Female: "Feminino", Male: "Masculino", Genderless: "Sem gênero", unknown: "Desconhecido" } as Record<string, string>,
    species: {
      Human: "Humano",
      Alien: "Alienígena",
      Humanoid: "Humanoide",
      Robot: "Robô",
      Animal: "Animal",
      "Mythological Creature": "Criatura mitológica",
      Poopybutthole: "Poopybutthole",
      Cronenberg: "Cronenberg",
      Disease: "Doença",
      unknown: "Desconhecida",
    } as Record<string, string>,
    locationType: {
      Planet: "Planeta",
      "Space station": "Estação espacial",
      Dimension: "Dimensão",
      Microverse: "Microverso",
      Miniverse: "Miniverso",
      Teenyverse: "Teenyverso",
      Cluster: "Aglomerado",
      Spacecraft: "Nave espacial",
      Dream: "Sonho",
      Diegesis: "Diegese",
      "Fantasy town": "Cidade de fantasia",
      Resort: "Resort",
      TV: "TV",
      Game: "Jogo",
      Menagerie: "Zoológico",
      Asteroid: "Asteroide",
      Customs: "Alfândega",
      Daycare: "Creche",
      "Death Star": "Estrela da Morte",
      unknown: "Desconhecido",
    } as Record<string, string>,
    unknownPlace: "Desconhecido",
    unknownDimension: "Dimensão desconhecida",
  },
  en: {
    status: { Alive: "Alive", Dead: "Dead", unknown: "Unknown" } as Record<string, string>,
    gender: { Female: "Female", Male: "Male", Genderless: "Genderless", unknown: "Unknown" } as Record<string, string>,
    species: {
      Human: "Human",
      Alien: "Alien",
      Humanoid: "Humanoid",
      Robot: "Robot",
      Animal: "Animal",
      "Mythological Creature": "Mythological creature",
      Poopybutthole: "Poopybutthole",
      Cronenberg: "Cronenberg",
      Disease: "Disease",
      unknown: "Unknown",
    } as Record<string, string>,
    locationType: { unknown: "Unknown" } as Record<string, string>,
    unknownPlace: "Unknown",
    unknownDimension: "Unknown dimension",
  },
};

export type LabelKind = "status" | "gender" | "species" | "locationType";

/** Valores com tradução (para os filtros). */
export const labelOptions = (lang: Lang, kind: Exclude<LabelKind, "locationType">) => LABELS[lang][kind];

export function makeLabels(lang: Lang) {
  const l = LABELS[lang];
  const locale = lang === "pt" ? "pt-BR" : "en";
  const formats = {
    short: new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }),
    long: new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }),
  };
  return {
    label: (kind: LabelKind, value: string) => l[kind][value] ?? value,
    /** "unknown" vira "Desconhecido"; nomes de lugares ficam como vêm da API. */
    place: (name: string) => (name === "unknown" ? l.unknownPlace : name),
    dimension: (value: string) => (value === "unknown" ? l.unknownDimension : value),
    date: (value: string, style: keyof typeof formats = "short") => {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? value : formats[style].format(d);
    },
    number: (n: number) => n.toLocaleString(locale),
  };
}

// ---------- Idioma atual ----------

/** Idioma inicial: ?lang= na URL (vem do portfólio), depois o salvo, depois o do navegador. */
export function initialLang(): Lang {
  const param = new URLSearchParams(location.search).get("lang");
  if (param === "pt" || param === "en") return param;
  try {
    const saved = localStorage.getItem("rm:lang");
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    /* sem armazenamento local */
  }
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem("rm:lang", lang);
  } catch {
    /* sem armazenamento local */
  }
}

export interface I18n {
  lang: Lang;
  t: Strings;
  l: ReturnType<typeof makeLabels>;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18n>({ lang: "pt", t: pt, l: makeLabels("pt"), setLang: () => {} });
export const useI18n = () => useContext(I18nContext);
