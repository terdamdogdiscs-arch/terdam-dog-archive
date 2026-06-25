# TerdamDog Archive

**EST. 2026 · BRASIL · VINYL COLLECTOR · ANTIFA · 174 BPM**

Este não é um catálogo. É um arquivo vivo.

A coleção Terdam Dog não é sobre raridade. É sobre conexões. **36 discos**, uma
narrativa: começa no Brasil, atravessa a música jamaicana, encontra Nova York
pelo hip-hop, abre passagem para o jazz e retorna ao Brasil. Depois mergulha nas
raízes brasileiras (a sequência de Referências), dá a volta à Jamaica com Jimmy
Cliff e abre um novo capítulo com a Família Marley.

Cada disco ocupa uma função dentro dessa narrativa — alguns abrem portas, outros
fazem pontes, outros conversam de igual para igual com o mundo.

🔗 [@terdamdogdiscs](https://instagram.com/terdamdogdiscs)

---

## As sequências da coleção

| Sequência | Discos | Papel |
|---|---|---|
| **Sequência Principal** | 001–024 | A espinha dorsal: Brasil → reggae → hip-hop → jazz → e a volta para casa. |
| **Referências** | 025–034 | Raízes atemporais (Caymmi, Adoniran, Cartola, samba-de-breque, pagode). |
| **Viradas** | 013 · 019 · 035 | Os discos onde a narrativa muda de direção. |
| **Família Marley** | 036+ | A família que sustentou o reggae por dentro. |

Dentro da Sequência Principal, os discos se agrupam por bloco: Origem Brasil
(001), Bloco Reggae (002–007), Bloco Hip-Hop (008–012), Bloco Jazz (014–018) e
Bloco Jorge Ben (020–024).

## Os cinco pilares

🌴 **Reggae** · 🎤 **Hip-Hop** · 🎷 **Jazz** · 🇧🇷 **Brasil** · 🥁 **Pagode/Samba**

Contagem de discos e tempo total de escuta de cada pilar são calculados
dinamicamente a partir do catálogo.

## As páginas do arquivo

- **Coleção** (`/`) — todos os discos, busca, jornadas de escuta, valor e curadoria da semana.
- **Jornada** (`/journey`) — a coleção disco a disco, com navegação por sequência/bloco.
- **Ensaio** (`/essay`) — o manifesto da coleção, com teses reais como exemplos vivos.
- **Narrativa** (`/narrative`) — como os discos se conectam.
- **Descoberta** (`/discover`) — motor de gaps: sugere o que falta com base no catálogo real.
- **Insights / Análises** (`/insights`) — gêneros, países, décadas, durações e índice.
- **Cofre** (`/vault`, `/vault/dashboard`) — valor estimado e itens mais valiosos (protegido por senha).
- **Visualizações** — Mapa de Calor (`/heatmap`), Linha do Tempo (`/timeline`), Universo (`/universe`), Mundo (`/world`).
- **Feed** (`/feed`), **Gênero** (`/genre/[slug]`), **Álbum** (`/album/[catalog]`), entre outras.

## Stack

- [Next.js 16.2.9](https://nextjs.org) — App Router (Server Components)
- React 19.2.4 · TypeScript 5
- Tailwind CSS 4

## Estrutura

```
app/
  data/        albums, captions, connections, notes, tracks,
               paths, dna, acquisitions, seed (merge central)
  lib/         discogs, genreColor, genreGroup, narrative, stats
  components/  BottomNav, CoverImage, FadeIn, JourneyNav,
               VaultGate, VaultLogin
  api/vault/auth   endpoint de autenticação do Cofre
  <rotas...>   page.tsx por seção
public/covers/   capas dos discos (NNN.jpg)
```

A fonte da verdade é `app/data/albums.ts` (um objeto por disco). `seed.ts` faz o
merge com tracks/notes/dna/acquisitions e expõe `collectionSeed` /
`collectionStats`, recalculados a cada build — adicionar um disco propaga
automaticamente para stats, jornadas, ensaio e descoberta.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run start    # serve o build
npm run lint
```

### Variável de ambiente

O Cofre (`/vault` e cards de valor financeiro) é protegido por senha no servidor.
Defina, sem o prefixo `NEXT_PUBLIC_`:

```
VAULT_PASSWORD=suasenha
```

No Vercel, cadastre em *Settings → Environment Variables* (Production/Preview).
Localmente, crie um arquivo `.env.local` (já ignorado pelo git).

## Acompanhe

Instagram: [@terdamdogdiscs](https://instagram.com/terdamdogdiscs)
