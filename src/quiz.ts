// Perguntas do quiz, geradas a partir da cópia local dos dados.
// As perguntas guardam só ids e códigos; a tela monta o texto no idioma escolhido.
import { seasonOf, type Catalog, type Character, type Status } from "./data";

export type Difficulty = "facil" | "medio" | "dificil";
export const DIFFICULTIES: Difficulty[] = ["facil", "medio", "dificil"];
export const LENGTHS = [10, 20] as const;

export type Question =
  /** Foto do personagem; opções são personagens (pelo nome). */
  | { kind: "who"; character: number; options: number[]; answer: number }
  | { kind: "status"; character: number; options: Status[]; answer: number }
  | { kind: "species"; character: number; options: string[]; answer: number }
  /** Opções são locais. */
  | { kind: "origin"; character: number; options: number[]; answer: number }
  /** Opções são números de temporada. */
  | { kind: "season"; episode: number; options: number[]; answer: number }
  /** Opções são personagens (com foto); só um aparece no episódio. */
  | { kind: "cast"; episode: number; options: number[]; answer: number }
  /** Opções são episódios. */
  | { kind: "debut"; character: number; options: number[]; answer: number };

export type Kind = Question["kind"];

/** Personagens que entram em cada nível, pelo número de episódios em que aparecem. */
const MIN_EPISODES: Record<Difficulty, number> = { facil: 3, medio: 2, dificil: 1 };

const KINDS: Record<Difficulty, Kind[]> = {
  facil: ["who", "who", "status", "species", "cast"],
  medio: ["who", "status", "species", "cast", "origin", "season"],
  dificil: ["who", "status", "species", "cast", "origin", "season", "debut"],
};

const STATUSES: Status[] = ["Alive", "Dead", "unknown"];

const random = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Até `n` itens de `items` cujo rótulo ainda não apareceu (evita dois "Rick Sanchez" nas opções). */
function pickDistinct<T>(items: readonly T[], n: number, label: (item: T) => string, taken: Set<string>): T[] {
  const out: T[] = [];
  for (const item of shuffle(items)) {
    if (out.length === n) break;
    const key = label(item);
    if (taken.has(key)) continue;
    taken.add(key);
    out.push(item);
  }
  return out;
}

/** Junta a resposta certa às erradas em ordem aleatória. */
function withAnswer<T>(right: T, wrong: T[]): { options: T[]; answer: number } {
  const options = shuffle([right, ...wrong]);
  return { options, answer: options.indexOf(right) };
}

export class QuizMaker {
  private pool: Character[];
  private kinds: Kind[];
  private used = new Set<string>();

  constructor(
    private catalog: Catalog,
    difficulty: Difficulty,
  ) {
    this.pool = catalog.characters.filter((c) => c.episodes.length >= MIN_EPISODES[difficulty]);
    this.kinds = KINDS[difficulty];
  }

  /** Uma partida com `length` perguntas, sem repetir a mesma pergunta. */
  game(length: number): Question[] {
    const out: Question[] = [];
    // Tipos em sequência embaralhada, para variar sem repetir o mesmo tipo muitas vezes.
    let bag: Kind[] = [];
    for (let tries = 0; out.length < length && tries < length * 20; tries++) {
      if (!bag.length) bag = shuffle(this.kinds);
      const question = this.make(bag.pop()!);
      if (question) out.push(question);
    }
    return out;
  }

  private fresh(kind: Kind, id: number) {
    const key = `${kind}:${id}`;
    if (this.used.has(key)) return false;
    this.used.add(key);
    return true;
  }

  private character(kind: Kind, accept: (c: Character) => boolean = () => true): Character | null {
    for (let i = 0; i < 40; i++) {
      const c = random(this.pool);
      if (accept(c) && this.fresh(kind, c.id)) return c;
    }
    return null;
  }

  private make(kind: Kind): Question | null {
    const { catalog } = this;
    switch (kind) {
      case "who": {
        const c = this.character(kind);
        if (!c) return null;
        // Erradas da mesma espécie, quando possível, para a foto não entregar a resposta.
        const taken = new Set([c.name]);
        const same = this.pool.filter((o) => o.species === c.species && o.id !== c.id);
        const wrong = pickDistinct(same, 3, (o) => o.name, taken);
        wrong.push(...pickDistinct(this.pool, 3 - wrong.length, (o) => o.name, taken));
        if (wrong.length < 3) return null;
        return { kind, character: c.id, ...withAnswer(c.id, wrong.map((o) => o.id)) };
      }
      case "status": {
        const c = this.character(kind);
        if (!c) return null;
        return { kind, character: c.id, options: STATUSES, answer: STATUSES.indexOf(c.status) };
      }
      case "species": {
        const c = this.character(kind);
        if (!c) return null;
        const species = [...new Set(catalog.characters.map((o) => o.species))].filter((s) => s !== c.species && s !== "unknown");
        return { kind, character: c.id, ...withAnswer(c.species, shuffle(species).slice(0, 3)) };
      }
      case "origin": {
        const c = this.character(kind, (o) => o.origin.id !== null);
        if (!c) return null;
        // Erradas entre os lugares de origem de outros personagens do nível (lugares conhecidos).
        const places = [...new Set(this.pool.map((o) => o.origin.id).filter((id): id is number => id !== null && id !== c.origin.id))];
        const taken = new Set([c.origin.name]);
        const wrong = pickDistinct(places, 3, (id) => catalog.locations.get(id)?.name ?? "", taken);
        if (wrong.length < 3) wrong.push(...pickDistinct(catalog.locationList.map((l) => l.id), 3 - wrong.length, (id) => catalog.locations.get(id)!.name, taken));
        return { kind, character: c.id, ...withAnswer(c.origin.id!, wrong) };
      }
      case "season": {
        const episode = random(catalog.episodeList);
        if (!this.fresh(kind, episode.id)) return null;
        const seasons = [...new Set(catalog.episodeList.map((e) => seasonOf(e.code)))];
        const right = seasonOf(episode.code);
        const wrong = shuffle(seasons.filter((s) => s !== right)).slice(0, 3);
        const options = [right, ...wrong].sort((a, b) => a - b);
        return { kind, episode: episode.id, options, answer: options.indexOf(right) };
      }
      case "cast": {
        const episode = random(catalog.episodeList);
        const cast = new Set(episode.characters);
        const inCast = this.pool.filter((c) => cast.has(c.id));
        const outside = this.pool.filter((c) => !cast.has(c.id));
        if (!inCast.length || outside.length < 3 || !this.fresh(kind, episode.id)) return null;
        const right = random(inCast);
        const taken = new Set([right.name]);
        const wrong = pickDistinct(outside, 3, (o) => o.name, taken);
        if (wrong.length < 3) return null;
        return { kind, episode: episode.id, ...withAnswer(right.id, wrong.map((o) => o.id)) };
      }
      case "debut": {
        const c = this.character(kind, (o) => o.episodes.length > 0);
        if (!c) return null;
        const first = Math.min(...c.episodes);
        const others = catalog.episodeList.map((e) => e.id).filter((id) => id !== first);
        return { kind, character: c.id, ...withAnswer(first, shuffle(others).slice(0, 3)) };
      }
    }
  }
}

/** Ids de personagens cuja foto aparece na pergunta (para carregar antes). */
export function questionImages(q: Question): number[] {
  if (q.kind === "cast") return q.options;
  if ("character" in q) return [q.character];
  return [];
}

// ---------- Melhor resultado ----------

const BEST_KEY = "rm:quiz-best";

export function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Guarda o maior número de acertos por nível e tamanho; devolve true se for recorde. */
export function saveBest(key: string, score: number): boolean {
  const best = readBest();
  if ((best[key] ?? -1) >= score) return false;
  best[key] = score;
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    /* sem armazenamento local */
  }
  return true;
}
