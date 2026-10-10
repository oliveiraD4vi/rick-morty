# Rick and Morty · Guia da série

Guia da série em **português e inglês** (`?lang=pt` ou `?lang=en` na URL), com personagens,
episódios e locais, todos ligados entre si:

- **Personagens:** busca por nome, filtros por situação, espécie e gênero, e rolagem infinita.
- **Episódios:** agrupados por temporada, com o elenco de cada um.
- **Locais:** planetas, dimensões e outros lugares, com os moradores de cada um.
- **Detalhes ligados:** do personagem se vai à origem, à localização e aos episódios; do
  episódio, ao elenco; do local, aos moradores. O "voltar" do navegador volta ao detalhe anterior.

Seção, filtros e detalhe aberto ficam na URL, então qualquer tela pode ser compartilhada por link.

**Acesse:** [rick-morty.coaladev.com.br](https://rick-morty.coaladev.com.br)

Os dados vêm da [Rick and Morty API](https://rickandmortyapi.com). Como ela limita rajadas de
requisições, o app usa uma cópia local dos dados (`src/data/snapshot.json`, gerada por
`npm run snapshot`) e as imagens passam por `/avatar/`, que o servidor guarda em cache.

## Stack

- [React 19](https://react.dev) e TypeScript
- [Vite](https://vite.dev)
- CSS próprio, sem biblioteca de componentes

## Rodando

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
```

Com Docker (em produção, as imagens em `/avatar/` são servidas por um proxy na frente do
container, que guarda em cache as da API):

```bash
docker build -t rick-morty .
docker run -p 4703:80 rick-morty
```
