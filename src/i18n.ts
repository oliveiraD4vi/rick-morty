// Textos da interface e tradução dos valores da API, em português e inglês.
// Nomes de personagens, episódios e lugares ficam como vêm da API (são nomes próprios).
import { createContext, useContext } from "react";

export type Lang = "pt" | "en";

const pt = {
  eyebrow: "Guia da série",
  lead: "Personagens, episódios e lugares da série, todos ligados entre si, e um quiz para testar o que você sabe. Dados da",
  tabs: { personagens: "Personagens", episodios: "Episódios", locais: "Locais", quiz: "Quiz" },
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
  quiz: {
    title: "Quanto você sabe de Rick and Morty?",
    lead: "Perguntas sobre personagens, episódios e lugares da série, geradas a cada partida.",
    level: "Nível",
    levels: { facil: "Fácil", medio: "Médio", dificil: "Difícil" },
    levelHints: {
      facil: "Personagens que aparecem em vários episódios",
      medio: "Mais personagens, origem de cada um e temporada dos episódios",
      dificil: "Todos os personagens, até a primeira aparição de cada um",
    },
    length: "Tamanho",
    questions: (n: number) => `${n} perguntas`,
    start: "Começar",
    best: (n: number, total: number) => `Recorde: ${n} de ${total}`,
    progress: (i: number, n: number) => `Pergunta ${i} de ${n}`,
    points: (n: number): string => (n === 1 ? "acerto" : "acertos"),
    streak: (n: number) => `${n} seguidas`,
    mystery: "Personagem misterioso",
    episode: "Episódio",
    prompts: {
      who: "Quem é este personagem?",
      status: (name: string) => `Qual a situação de ${name}?`,
      species: (name: string) => `Qual a espécie de ${name}?`,
      origin: (name: string) => `De onde vem ${name}?`,
      debut: (name: string) => `Em qual episódio ${name} aparece pela primeira vez?`,
      season: (episode: string) => `Em qual temporada está “${episode}”?`,
      cast: (episode: string) => `Quem aparece em “${episode}”?`,
    },
    /** Com o nome do episódio já no cartão, acima da pergunta. */
    here: { season: "Em qual temporada está este episódio?", cast: "Quem aparece neste episódio?" },
    right: "Acertou!",
    wrong: "Errou.",
    answerWas: (answer: string) => `A resposta é ${answer}.`,
    seeInGuide: "Ver no guia",
    next: "Próxima",
    finish: "Ver resultado",
    result: (n: number, total: number) => `${n} de ${total}`,
    verdicts: { top: "Nível Rick Sanchez.", good: "Nada mal, Morty.", low: "Hora de rever a série." },
    newBest: "Novo recorde!",
    playAgain: "Jogar de novo",
    changeLevel: "Mudar o nível",
    review: "Respostas",
  },
};

const en: typeof pt = {
  eyebrow: "Series guide",
  lead: "The show's characters, episodes and places, all linked together, plus a quiz to test what you know. Data from the",
  tabs: { personagens: "Characters", episodios: "Episodes", locais: "Locations", quiz: "Quiz" },
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
  quiz: {
    title: "How well do you know Rick and Morty?",
    lead: "Questions about the show's characters, episodes and places, new ones every game.",
    level: "Level",
    levels: { facil: "Easy", medio: "Medium", dificil: "Hard" },
    levelHints: {
      facil: "Characters who show up in several episodes",
      medio: "More characters, where each one is from and each episode's season",
      dificil: "Every character, down to their first appearance",
    },
    length: "Length",
    questions: (n: number) => `${n} questions`,
    start: "Start",
    best: (n: number, total: number) => `Best: ${n} of ${total}`,
    progress: (i: number, n: number) => `Question ${i} of ${n}`,
    points: (_n: number): string => "correct",
    streak: (n: number) => `${n} in a row`,
    mystery: "Mystery character",
    episode: "Episode",
    prompts: {
      who: "Who is this character?",
      status: (name: string) => `What is ${name}'s status?`,
      species: (name: string) => `What species is ${name}?`,
      origin: (name: string) => `Where is ${name} from?`,
      debut: (name: string) => `In which episode does ${name} first appear?`,
      season: (episode: string) => `Which season is “${episode}” in?`,
      cast: (episode: string) => `Who appears in “${episode}”?`,
    },
    here: { season: "Which season is this episode in?", cast: "Who appears in this episode?" },
    right: "Correct!",
    wrong: "Wrong.",
    answerWas: (answer: string) => `The answer is ${answer}.`,
    seeInGuide: "See in the guide",
    next: "Next",
    finish: "See results",
    result: (n: number, total: number) => `${n} of ${total}`,
    verdicts: { top: "Rick Sanchez level.", good: "Not bad, Morty.", low: "Time to rewatch the show." },
    newBest: "New best!",
    playAgain: "Play again",
    changeLevel: "Change level",
    review: "Answers",
  },
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
