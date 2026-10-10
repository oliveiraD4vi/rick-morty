// Baixa todos os personagens, episódios e locais da Rick and Morty API para src/data/snapshot.json.
// A API limita rajadas de requisições, então o script vai devagar e tenta de novo após um 429.
// Uso: npm run snapshot
import { writeFile } from "node:fs/promises";

const BASE = "https://rickandmortyapi.com/api";
const OUT = new URL("../src/data/snapshot.json", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, attempt = 1) {
  const res = await fetch(url);
  if (res.status === 429 && attempt <= 8) {
    const wait = 2000 * attempt;
    console.warn(`429 em ${url}, esperando ${wait / 1000}s`);
    await sleep(wait);
    return get(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} em ${url}`);
  await sleep(700);
  return res.json();
}

async function all(resource) {
  const items = [];
  let url = `${BASE}/${resource}`;
  while (url) {
    const page = await get(url);
    items.push(...page.results);
    url = page.info.next;
    process.stdout.write(`\r${resource}: ${items.length}/${page.info.count}`);
  }
  process.stdout.write("\n");
  return items;
}

const idOf = (url) => (url ? Number(url.split("/").pop()) : null);
const place = (p) => ({ name: p.name, id: idOf(p.url) });

const characters = (await all("character")).map((c) => ({
  id: c.id,
  name: c.name,
  status: c.status,
  species: c.species,
  type: c.type,
  gender: c.gender,
  origin: place(c.origin),
  location: place(c.location),
  episodes: c.episode.map(idOf),
}));

const episodes = (await all("episode")).map((e) => ({
  id: e.id,
  name: e.name,
  air_date: e.air_date,
  code: e.episode,
  characters: e.characters.map(idOf),
}));

const locations = (await all("location")).map((l) => ({
  id: l.id,
  name: l.name,
  type: l.type,
  dimension: l.dimension,
  residents: l.residents.map(idOf),
}));

await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), characters, episodes, locations }));
console.log(`ok: ${characters.length} personagens, ${episodes.length} episódios e ${locations.length} locais`);
