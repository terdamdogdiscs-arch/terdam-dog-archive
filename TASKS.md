# TASKS.md — TerdamDog Archive
# Execute cada item com: "Execute TASKS.md item [número]"

---

## IDENTIDADE DA MARCA
Paleta: verde #2d8c3e | vermelho #c8202a | amarelo #f5c400 | roxo #7b2d8b | preto #0c0c0c | creme #f0ede4
Tipografia: Anton (títulos/display) + Oswald (UI/corpo)
Logo: vinil preto + anéis verde→vermelho→amarelo→roxo + badge creme
Tagline: EST. 2026 · BRASIL · VINYL COLLECTOR · ANTIFA · 174 BPM
Instagram: @terdamdogdiscs
Site: https://terdam-dog-archive.vercel.app

---

## SPRINT ATUAL — PREMIUM & NARRATIVA

### Item 1 — Conexões narrativas entre discos
Na página de cada álbum (app/album/[catalog]/page.tsx):
- Adicione seção "POR QUE ESTE DISCO LEVA AO PRÓXIMO"
- Use connections.ts para buscar conexão com disco seguinte e anterior
- Mostre o campo "reason" como título da conexão
- Adicione texto explicativo de 1-2 linhas sobre o fio condutor
- Estilo: card escuro, borda brand-purple, tipografia Oswald, seta visual entre os discos
- Após: git add . && git commit -m "feat: conexões narrativas entre discos" && git push

### Item 2 — Logo maior e premium
- Home: logo de 64×64 para 120×120px
- Header/layout: logo para 96×96px
- Trocar object-cover por object-contain para não cortar os anéis coloridos
- Após: git add . && git commit -m "feat: logo maior e sem corte" && git push

### Item 3 — Elevação visual premium
- Micro-animações: fade-in nos cards ao scrollar via Intersection Observer
- Bordas dos cards: 1px → 1.5px com opacity gradient sutil
- Tags de gênero: padding maior + letter-spacing mais espaçado
- Números grandes (19, 100/100, R$3690): font-size maior + brand color
- Separadores: substituir bordas simples por gradientes brand-green → brand-purple
- Após: git add . && git commit -m "feat: elevação visual premium" && git push

### Item 4 — Navegação premium
- BottomNav: barra brand-yellow acima do ícone ativo
- Transição entre páginas: fade suave
- Após: git add . && git commit -m "feat: navegação premium" && git push

### Item 5 — Elevação da página de álbum
- Hero da capa: min-h-[280px]
- Adicionar "PRESSING" e "LABEL" em destaque no Collector Card
- Número do disco (TD-001): font-size maior em brand-yellow
- Após: git add . && git commit -m "feat: álbum page premium" && git push

### Item 6 — PT-BR completo + limpeza
- Varrer todas as 20 páginas e traduzir textos ainda em inglês
- Remover ou substituir "diáspora" na home
- Confirmar metadata title/description não é mais "Create Next App"
- Confirmar lang="pt-BR" no html
- Após: git add . && git commit -m "fix: PT-BR completo e limpeza" && git push

### Item 7 — Discover aprimorada
- Usar connections.ts para o motivo da sugestão (não só gênero)
- "Baseado no que você já tem" com conexões reais
- Após: git add . && git commit -m "feat: discover com conexões reais" && git push

### Item 8 — Curator dinâmico
- /curator: "Disco da semana" deve rodar semanalmente (não fixo em 007)
- Usar new Date() para calcular semana do ano e selecionar disco pelo índice
- Diferenciar visualmente do "Seleção do Curador" da home (esse é diário)
- Após: git add . && git commit -m "feat: curator dinâmico por semana" && git push

### Item 9 — Consolidar 4 pilares
- Criar app/data/pillars.ts como fonte única
- Substituir exploreItems (home), Pillar (/essay), universe.nodes (/universe) por import de pillars.ts
- Após: git add . && git commit -m "refactor: 4 pilares em fonte única" && git push

### Item 10 — Limpeza de rotas
- Avaliar /tracks, /sessions: remover se forem placeholders
- /analytics: fundir o útil dentro de /insights e remover rota
- Após: git add . && git commit -m "refactor: limpeza de rotas órfãs" && git push

---

## WORKFLOW — NOVO DISCO
Quando o usuário disser "novo disco" ou enviar foto de vinil:
1. Identificar artista e álbum
2. Pesquisar: ano, gravadora, pressing, faixas completas com lados A/B
3. Gerar bloco TypeScript completo seguindo estrutura de albums.ts
4. Adicionar entrada em connections.ts linkando ao disco anterior
5. Adicionar entrada em notes.ts com previous/next
6. Adicionar entrada em acquisitions.ts se houver dados de compra
7. git add . && git commit -m "disco #[N]: [Artista] — [Álbum]" && git push

---

## CATÁLOGO ATUAL
001 | Black Alien | Babylon by Gus Vol.1 | 2004 | Hip Hop / Rap | Brasil
002 | Junior Byles | Beat Down Babylon | 1972 | Roots Reggae | Jamaica
003 | Various Artists | Rudeboy: The Story of Trojan Records | 2018 | Ska/Rocksteady/Reggae | Jamaica/UK
004 | Toots & the Maytals | Funky Kingston | 1973 | Reggae/Soul | Jamaica
005 | Errol Dunkley | O.K. Fred: Best Of | 2024 | Reggae | Jamaica
006 | Alpha Blondy | Apartheid Is Nazism | 1985 | African Reggae | Costa do Marfim
007 | Shinehead | Sidewalk University | 1992 | Dancehall/Ragga/Hip-Hop | Jamaica/EUA
008 | Eric B. & Rakim | Paid in Full | 1987 | Golden Age Hip-Hop | EUA
009 | Queen Latifah | All Hail the Queen | 1989 | Hip-Hop | EUA
010 | Fugees | The Score | 1996 | Hip-Hop | EUA
011 | A Tribe Called Quest | Hits, Rarities & Remixes | 2003 | Hip-Hop | EUA
012 | De La Soul | De La Soul Is Dead | 1991 | Hip-Hop | EUA
013 | Guru | Jazzmatazz Vol. 1 | 1993 | Jazz-Rap | EUA
014 | Sonny Rollins | The Quartets | 1962 | Hard Bop/Jazz | EUA
015 | Arthur Blythe | In the Tradition | 1979 | Hard Bop/Jazz | EUA
016 | Charles Mingus | Mingus at Monterey | 1964 | Jazz/Live | EUA
017 | Oscar Peterson | Girl Talk Vol. II | 1968 | Piano Jazz | Canadá
018 | Terry/Hubbard/Gillespie+Peterson | The Alternate Blues | 1982 | Jazz/Blues | EUA
019 | Sergio Mendes & Brasil '66 | Herb Alpert Presents | 1966 | Bossa Nova/Pop | Brasil
020 | Jorge Ben | Força Bruta | 1970 | Samba Soul | Brasil (pendente)

---

## PRÓXIMOS BLOCOS DE DISCOS
Bloco atual: Jazz (014-018) + Virada Sergio Mendes (019)
Próximo bloco: Jorge Ben (5 discos — 020 a 024)
Depois: a definir com o usuário
