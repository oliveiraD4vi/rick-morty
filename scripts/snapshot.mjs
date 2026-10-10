// Baixa todos os personagens e episódios da Rick and Morty API para src/data/snapshot.json.
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

const idOf = (url) => Number(url.split("/").pop());

const characters = (await all("character")).map((c) => ({
  id: c.id,
  name: c.name,
  status: c.status,
  species: c.species,
  type: c.type,
  gender: c.gender,
  origin: c.origin.name,
  location: c.location.name,
  episodes: c.episode.map(idOf),
}));

const episodes = (await all("episode")).map((e) => ({ id: e.id, name: e.name, air_date: e.air_date, code: e.episode }));

await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), characters, episodes }));
console.log(`ok: ${characters.length} personagens e ${episodes.length} episódios`);
