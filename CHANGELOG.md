# CHANGELOG — TerdamDog Archive

Registro de todas as mudanças significativas no projeto, em ordem cronológica (mais recente primeiro).

---

## 2026-06-28 — Legend encerra a sequência Família Marley

**Commit:** incluído neste commit

**O que mudou:** O disco #039, *Legend* de Bob Marley & The Wailers, entrou no arquivo com a edição original de 1984 confirmada no Discogs, capa oficial, quatorze faixas e durações completas. A narrativa conecta o disco a *Soul Rebel*, amplia a Família Marley para quatro títulos e atualiza a jornada Raízes do Reggae para 11 discos e 6h32 de escuta conhecida.

**Por quê:** Mostrar como uma seleção editorial ajudou a construir a memória pública de Bob Marley e concluir o arco que parte da formação artística para chegar ao legado.

**Arquivos afetados:** `app/data/albums.ts`, `app/data/tracks.ts`, `app/data/connections.ts`, `app/data/notes.ts`, `app/data/captions.ts`, `app/data/paths.ts`, `CHANGELOG.md`

---

## 2026-06-25 — Dados transformados em narrativa visual

**Commit:** incluído neste commit

**O que mudou:** A página Dados foi reconstruída como uma experiência editorial responsiva, com abertura em formato de revista, indicadores essenciais, composição por gêneros, histograma cronológico, mapa de origens culturais, rede de conexões e faixa proporcional do tempo de escuta. Informações de prensagem deixaram de influenciar a leitura geográfica e histórica.

**Por quê:** Fazer os dados explicarem a identidade e a trajetória musical da coleção, reduzindo a aparência de painel administrativo e elevando a qualidade visual e narrativa da experiência.

**Arquivos afetados:** `app/insights/page.tsx`, `app/components/InsightsCharts.tsx`, `CHANGELOG.md`

---

## 2026-06-24 — Catálogo e valores alinhados ao Discogs

**Commit:** incluído neste commit

**O que mudou:** Os 36 discos foram conferidos pelas edições exatas vinculadas no Discogs. Títulos, artistas, anos, países, gêneros, estilos, gravadoras, formatos, números de catálogo e quantidades de faixas agora refletem esses registros; os valores foram recalculados por uma referência média do mercado ativo.

**Por quê:** Eliminar divergências entre o arquivo e as prensagens realmente cadastradas, oferecendo uma estimativa financeira mais coerente e verificável.

**Arquivos afetados:** `app/data/albums.ts`, `CHANGELOG.md`

---

## 2026-06-24 — Ensaio transformado em revista editorial

**Commit:** este commit

**O que mudou:** O Ensaio passou a contar a coleção em quatro atos — origem, pontes, retorno e história em aberto — usando capas e teses dos discos como parte da narrativa. Os cinco territórios da escuta ganharam uma explicação editorial e o encerramento agora conduz o leitor para a Jornada.

**Por quê:** Fazer a página funcionar como uma experiência de leitura e descoberta, reduzindo a aparência de painel de dados e aproximando as ideias dos discos que lhes dão sentido.

**Arquivos afetados:** `app/essay/page.tsx`

---

## 2026-06-23 — Experiência responsiva e arquitetura de navegação

**Commit:** este commit

**O que mudou:** O arquivo ganhou uma experiência própria para desktop, navegação mobile mais compacta e uma Home com revelação progressiva de jornadas e discos. As áreas foram reorganizadas em Coleção, História, Descoberta, Feed, Por Vir e Dados; métricas de gênero passaram a usar macrogrupos coerentes e os cards do acervo agora levam a destinos reais.

**Por quê:** Reduzir a sobrecarga da primeira visita, eliminar rotas e interações ambíguas e fazer a identidade editorial funcionar com a mesma clareza no celular e em telas maiores.

**Arquivos afetados:** `app/page.tsx`, `app/globals.css`, `app/components/BottomNav.tsx`, `app/insights/page.tsx`, `app/coming/page.tsx`, `app/lib/genreGroup.ts`, páginas editoriais e redirecionamentos de rotas antigas

---

## 2026-06-23 — Sistema de changelog do projeto

**Commit:** este commit (o hash é gerado somente depois que seu conteúdo é fechado)

**O que mudou:** Foi criado este histórico editorial com a reconstrução dos 15 commits relevantes mais recentes. O fluxo de contribuição agora exige que toda tarefa com commit registre sua mudança aqui antes do envio ao GitHub.

**Por quê:** Manter uma memória legível da evolução do arquivo, sem depender apenas de mensagens técnicas espalhadas pelo histórico do Git.

**Arquivos afetados:** `CHANGELOG.md`, `CONTRIBUTING.md`

---

## 2026-06-23 — Ensaio mais conciso e conectado ao catálogo

**Commit:** `c511f38`

**O que mudou:** O ensaio perdeu seções redundantes e passou a calcular seus cinco pilares diretamente a partir do catálogo. Teses de discos reais foram incorporadas como exemplos vivos do manifesto.

**Por quê:** Aproximar o texto editorial da coleção que existe hoje e evitar números ou blocos que envelheçam separados dos dados.

**Arquivos afetados:** `app/essay/page.tsx`

---

## 2026-06-23 — Jazz incluído na frase narrativa da Home

**Commit:** `a0ea8ff`

**O que mudou:** Sonny Rollins, primeiro disco do bloco de jazz, passou a marcar “Jazz” como território narrativo. Com isso, a frase de abertura da Home finalmente reconhece essa etapa da jornada.

**Por quê:** O bloco estava presente no catálogo, mas invisível no resumo narrativo da coleção.

**Arquivos afetados:** `app/data/albums.ts`

---

## 2026-06-23 — Jornadas de Escuta com altura uniforme

**Commit:** `642f83a`

**O que mudou:** Os cards das jornadas receberam altura consistente, melhor distribuição interna e limites de linhas para título e descrição.

**Por quê:** Evitar desalinhamentos causados por textos de tamanhos diferentes e preservar o ritmo visual da Home.

**Arquivos afetados:** `app/page.tsx`

---

## 2026-06-23 — Jornada principal organizada por blocos musicais

**Commit:** `d06500f`

**O que mudou:** A sequência principal passou a ser dividida em oito categorias derivadas do catálogo, incluindo Reggae, Hip-Hop, Jazz, Jorge Ben, Referências e Família Marley. Papéis narrativos importantes também foram corrigidos.

**Por quê:** Representar com mais precisão a estrutura dos 36 discos e tornar a navegação pela história da coleção mais clara.

**Arquivos afetados:** `app/data/albums.ts`, `app/journey/page.tsx`

---

## 2026-06-22 — Navegação dinâmica na Jornada

**Commit:** `9669675`

**O que mudou:** A Jornada ganhou botões calculados a partir dos papéis dos discos, com contagem, intervalo de catálogo, identidade visual própria e rolagem suave até cada seção.

**Por quê:** Facilitar saltos entre grandes momentos da coleção sem manter categorias e números manualmente.

**Arquivos afetados:** `app/components/JourneyNav.tsx`, `app/journey/page.tsx`

---

## 2026-06-22 — Ensaio atualizado para os 36 discos

**Commit:** `059f589`

**O que mudou:** A narrativa do ensaio foi reescrita para incluir a sequência de Referências, o retorno à Jamaica e o início da Família Marley. A página também recebeu uma reformulação visual completa.

**Por quê:** O ensaio ainda descrevia uma fase anterior da coleção e precisava acompanhar a expansão do arquivo.

**Arquivos afetados:** `app/essay/page.tsx`

---

## 2026-06-22 — Afrobeat assume prioridade na descoberta

**Commit:** `d6ce80d`

**O que mudou:** O caminho de Choro foi retirado das sugestões prioritárias e Afrobeat passou a ocupar o grupo principal do Motor de Descoberta.

**Por quê:** Refletir melhor os vazios e caminhos adjacentes mais relevantes para o catálogo atual.

**Arquivos afetados:** `app/discover/page.tsx`

---

## 2026-06-22 — Motor de Descoberta baseado em lacunas reais

**Commit:** `f0ba953`

**O que mudou:** Sugestões fixas foram substituídas por cálculos feitos a partir dos álbuns e conexões existentes. O sistema passou a detectar sequências abertas, gêneros ausentes, décadas pouco representadas e regiões ainda não exploradas.

**Por quê:** Fazer com que as recomendações evoluam automaticamente junto com a coleção.

**Arquivos afetados:** `app/data/discover.ts` (removido), `app/discover/page.tsx`

---

## 2026-06-21 — Autenticação do Cofre estabilizada

**Commit:** `5f38af7`

**O que mudou:** Os registros temporários usados no diagnóstico da senha do Cofre foram removidos após a confirmação do funcionamento em produção.

**Por quê:** Encerrar a investigação da variável de ambiente e manter o endpoint sem informações de depuração desnecessárias.

**Arquivos afetados:** `app/api/vault/auth/route.ts`

---

## 2026-06-21 — Hashtag da coleção padronizada

**Commit:** `5ad9831`

**O que mudou:** Todas as 36 legendas passaram a incluir `#VinylCollection`, corrigindo os discos que ainda não seguiam o padrão.

**Por quê:** Manter consistência editorial e de publicação nas legendas do arquivo.

**Arquivos afetados:** `app/data/captions.ts`

---

## 2026-06-21 — Auditoria factual e editorial do catálogo

**Commit:** `421c68e`

**O que mudou:** O título de “Trem das Onze” foi corrigido, a classificação narrativa de Jazzmatazz foi ajustada e teses selecionadas receberam emojis coerentes com suas ideias.

**Por quê:** Alinhar os dados ao Discogs e melhorar a consistência entre catálogo, legendas e narrativa.

**Arquivos afetados:** `app/data/albums.ts`, `app/data/captions.ts`

---

## 2026-06-21 — Diagnóstico final da senha do Cofre

**Commit:** `fcd0fbe`

**O que mudou:** Foi adicionado um registro temporário para confirmar o comportamento da variável `VAULT_PASSWORD` durante a autenticação.

**Por quê:** Isolar a causa da falha observada no ambiente de produção.

**Arquivos afetados:** `app/api/vault/auth/route.ts`

---

## 2026-06-21 — Instrumentação temporária da autenticação

**Commit:** `1e39ab3`

**O que mudou:** O endpoint do Cofre passou temporariamente a registrar a presença e as características da variável de senha, sem revelar seu conteúdo.

**Por quê:** Verificar se a configuração da Vercel estava chegando corretamente ao runtime e forçar uma nova implantação.

**Arquivos afetados:** `app/api/vault/auth/route.ts`

---

## 2026-06-21 — Cofre protegido por senha

**Commit:** `88f4bab`

**O que mudou:** As páginas financeiras ganharam proteção por senha, cookie HTTP-only, tela de login e verificação no servidor. A Home passou a exibir apenas um acesso discreto ao Cofre, enquanto valores protegidos ficaram ocultos em Insights.

**Por quê:** Separar os dados financeiros pessoais da parte pública e editorial da coleção.

**Arquivos afetados:** `middleware.ts`, `app/api/vault/auth/route.ts`, `app/components/VaultGate.tsx`, `app/components/VaultLogin.tsx`, `app/insights/page.tsx`, `app/page.tsx`, `app/vault/`

---

## 2026-06-21 — Tese narrativa de Shinehead restaurada

**Commit:** `769bf5a`

**O que mudou:** A leitura editorial do disco 007 voltou a destacar Shinehead como ponte entre cidades, culturas, dancehall e hip-hop.

**Por quê:** Recuperar a tese correta do álbum e seu papel central na passagem da Jamaica para Nova York.

**Arquivos afetados:** `app/data/albums.ts`, `app/data/notes.ts`
