// Tradução dos valores da API para a interface.

export const STATUS: Record<string, string> = { Alive: "Vivo", Dead: "Morto", unknown: "Desconhecido" };

export const GENDER: Record<string, string> = {
  Female: "Feminino",
  Male: "Masculino",
  Genderless: "Sem gênero",
  unknown: "Desconhecido",
};

export const SPECIES: Record<string, string> = {
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
};

export const label = (map: Record<string, string>, value: string) => map[value] ?? value;

/** "unknown" vira "Desconhecido"; nomes de lugares ficam como vêm da API. */
export const place = (name: string) => (name === "unknown" ? "Desconhecido" : name);

export const LOCATION_TYPE: Record<string, string> = {
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
};

export const dimension = (value: string) => (value === "unknown" ? "Dimensão desconhecida" : value);
