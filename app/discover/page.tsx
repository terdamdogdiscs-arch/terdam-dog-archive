import Link from "next/link";
import { albums, type Album } from "../data/albums";
import { connections } from "../data/connections";
import BottomNav from "../components/BottomNav";

type DiscoveryPath = {
  id: string;
  title: string;
  reason: string;
  basedOn: string[];
  suggestions: string[];
  gap: number; // quanto maior, mais relevante é o gap
};

function decadeOf(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

function dedupe(values: string[]) {
  return Array.from(new Set(values));
}

// Mapa de candidatos a "preenchimento de década" — só emitido se a década
// estiver realmente sub-representada no catálogo atual.
const DECADE_SUGGESTIONS: Record<string, string[]> = {
  "1950s": [
    "João Gilberto — Chega de Saudade",
    "Tom Jobim — Sinfonia do Rio de Janeiro",
    "Elizeth Cardoso — Canção do Amor Demais",
    "Miles Davis — Kind of Blue",
  ],
  "1960s": [
    "Os Tincoãs — Os Tincoãs",
    "Clementina de Jesus — Clementina, Cadê Você?",
    "John Coltrane — A Love Supreme",
    "Cartola — Cartola (1974)",
  ],
  "2000s": [
    "Madvillain — Madvillainy",
    "Seu Jorge — Cru",
    "Sharon Jones & The Dap-Kings — Naturally",
    "Damian Marley — Welcome to Jamrock",
  ],
  "2010s": [
    "Kendrick Lamar — To Pimp a Butterfly",
    "BadBadNotGood — III",
    "Émile Londonien — Légende",
    "Criolo — Nó na Orelha",
  ],
  "2020s": [
    "Sault — Untitled (Black Is)",
    "Bixiga 70 — Vapor",
    "Yussef Dayes — Black Classical Music",
    "Hermeto Pascoal — Pra Você, Ilza",
  ],
};

function buildPaths(): DiscoveryPath[] {
  const total = albums.length;
  const traits = (a: Album) => `${a.genre} ${a.subgenre}`.toLowerCase();
  const genreBlob = albums.map(traits).join(" | ");
  const has = (kw: string) => genreBlob.includes(kw);

  const countries = new Set<string>();
  albums.forEach((a) =>
    a.country.split("/").forEach((c) => countries.add(c.trim().toLowerCase()))
  );
  const hasCountry = (kw: string) =>
    Array.from(countries).some((c) => c.includes(kw.toLowerCase()));

  const catsByTrait = (re: RegExp) =>
    albums.filter((a) => re.test(traits(a))).map((a) => a.catalog);

  const reggaeCats = catsByTrait(/reggae|ska|rocksteady/);
  const sambaCats = catsByTrait(/samba|pagode/);

  // Distribuição real por década
  const byDecade: Record<string, string[]> = {};
  albums.forEach((a) => {
    const d = decadeOf(a.year);
    (byDecade[d] ??= []).push(a.catalog);
  });
  const decadesSorted = Object.entries(byDecade).sort(
    (a, b) => a[1].length - b[1].length
  );

  const paths: DiscoveryPath[] = [];

  // 1) Sequência aberta: Família Marley
  const marley = albums.filter(
    (a) => a.role === "Família Marley" || /marley/i.test(a.artist)
  );
  if (marley.length > 0) {
    paths.push({
      id: "familia-marley",
      title: "Família Marley",
      reason: `A sequência Família Marley foi aberta há pouco e tem apenas ${marley.length} disco${
        marley.length === 1 ? "" : "s"
      } (#${marley
        .map((a) => a.catalog)
        .join(", #")}). É a continuação mais natural do bloco de reggae já existente.`,
      basedOn: dedupe([...marley.map((a) => a.catalog), ...reggaeCats]).slice(0, 4),
      suggestions: [
        "Bob Marley & The Wailers — Exodus",
        "Bunny Wailer — Blackheart Man",
        "Peter Tosh — Legalize It",
        "Ziggy Marley & The Melody Makers — Conscious Party",
        "Damian Marley — Welcome to Jamrock",
      ],
      gap: marley.length <= 2 ? 95 : 25,
    });
  }

  // 2) Década sub-representada (totalmente dinâmico)
  const [thinDecade, thinCats] = decadesSorted[0] ?? ["", []];
  if (thinDecade && DECADE_SUGGESTIONS[thinDecade] && thinCats.length <= 2) {
    paths.push({
      id: `decada-${thinDecade}`,
      title: `Década de ${thinDecade.replace("s", "")}`,
      reason: `Entre os ${total} discos, os anos ${thinDecade} aparecem em apenas ${
        thinCats.length
      } (#${thinCats.join(
        ", #"
      )}). É a década mais sub-representada do catálogo.`,
      basedOn: thinCats,
      suggestions: DECADE_SUGGESTIONS[thinDecade],
      gap: thinCats.length <= 1 ? 85 : 70,
    });
  }

  // 4) África além da Costa do Marfim: Afrobeat
  const africaCats = albums
    .filter(
      (a) =>
        /marfim|áfrica|africa|nigéria|nigeria/i.test(a.country) ||
        a.narrativeCountry === "África"
    )
    .map((a) => a.catalog);
  if (africaCats.length > 0) {
    paths.push({
      id: "afrobeat",
      title: "Afrobeat",
      reason: `A África entra na coleção só pelo reggae (#${africaCats.join(
        ", #"
      )}). O afrobeat conecta a percussão africana ao groove e à crítica social que já atravessam reggae e samba.`,
      basedOn: dedupe([...africaCats, ...reggaeCats]).slice(0, 4),
      suggestions: [
        "Fela Kuti — Zombie",
        "Tony Allen — Black Voices",
        "Ebo Taylor — Love and Death",
        "Antibalas — Antibalas",
      ],
      gap: has("afrobeat") ? 0 : 80,
    });
  }

  // 5) Caribe além da Jamaica: Cuba
  if (reggaeCats.length > 0 && !hasCountry("cuba")) {
    paths.push({
      id: "cuba",
      title: "Cuba / Caribe",
      reason: `O Caribe aparece só pela Jamaica. Cuba é o elo ausente entre a percussão afro-caribenha e o groove que a coleção já reúne.`,
      basedOn: reggaeCats.slice(0, 4),
      suggestions: [
        "Buena Vista Social Club — Buena Vista Social Club",
        "Irakere — Irakere",
        "Los Van Van — Te Pone la Cabeza Mala",
        "Celia Cruz & La Sonora Matancera — Cuba's Foremost Rhythm Singer",
      ],
      gap: 70,
    });
  }

  // 6) Lusofonia africana: Cabo Verde / Angola
  if (sambaCats.length > 0 && !hasCountry("cabo verde") && !hasCountry("angola")) {
    paths.push({
      id: "lusofonia",
      title: "Cabo Verde & Angola",
      reason: `A coleção tem Brasil e reggae africano, mas falta a ponte lusófona do Atlântico Sul — morna, semba e a herança que dialoga diretamente com o samba.`,
      basedOn: dedupe([...sambaCats, ...africaCats]).slice(0, 4),
      suggestions: [
        "Cesária Évora — Miss Perfumado",
        "Bonga — Angola 72",
        "Bana — Gira Sol",
        "Waldemar Bastos — Pretaluz",
      ],
      gap: 65,
    });
  }

  return paths.filter((p) => p.gap > 0).sort((a, b) => b.gap - a.gap);
}

function connectionReason(catalog: string) {
  const outgoing = connections.find((c) => c.source === catalog);
  if (outgoing) return outgoing.reason;
  const incoming = connections.find((c) => c.target === catalog);
  return incoming?.reason;
}

export default function DiscoverPage() {
  const allPaths = buildPaths();
  const paths = allPaths.slice(0, 3);

  const byDecade: Record<string, number> = {};
  albums.forEach((a) => {
    const d = decadeOf(a.year);
    byDecade[d] = (byDecade[d] || 0) + 1;
  });
  const countries = new Set<string>();
  albums.forEach((a) =>
    a.country.split("/").forEach((c) => countries.add(c.trim()))
  );

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          MOTOR DE DESCOBERTA
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O que falta na coleção.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Análise dinâmica dos {albums.length} discos atuais —{" "}
          {countries.size} países e {Object.keys(byDecade).length} décadas. Os
          caminhos abaixo são recalculados a cada visita a partir dos gaps reais
          do catálogo.
        </p>
      </section>

      <section className="space-y-6">
        {paths.map((block) => {
          const baseAlbums = block.basedOn
            .map((catalog) => albums.find((album) => album.catalog === catalog))
            .filter((album): album is Album => Boolean(album));

          return (
            <article
              key={block.id}
              className="premium-card rounded-3xl border border-[#2b241c] bg-[#11100e] p-5"
            >
              <p className="text-xs tracking-[0.3em] text-purple-400">
                CAMINHO DE DESCOBERTA
              </p>

              <h2 className="text-3xl font-black mt-3">{block.title}</h2>

              <p className="text-[#b8aa91] mt-4 leading-relaxed">
                {block.reason}
              </p>

              <div className="mt-5">
                <p className="text-sm text-[#9d9079] mb-3">
                  Baseado no que você já tem:
                </p>

                <div className="space-y-2">
                  {baseAlbums.map((album) => {
                    const reason = connectionReason(album.catalog);

                    return (
                      <Link
                        key={album.catalog}
                        href={`/album/${album.catalog}`}
                        className="flex items-center gap-3 rounded-2xl border border-[#2b241c] bg-brand-black p-3 hover:border-purple-500 transition"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#2b241c]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={album.cover}
                            alt={album.album}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-purple-400">
                            TD-{album.catalog}
                          </p>
                          <p className="truncate text-sm font-black leading-tight">
                            {album.artist}
                          </p>
                          <p className="truncate text-xs text-[#b8aa91]">
                            {album.album}
                          </p>
                          {reason && (
                            <p className="mt-1 text-[10px] tracking-[0.15em] text-brand-yellow">
                              ↳ {reason}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-[#9d9079] mb-3">Talvez falte:</p>

                <div className="space-y-3">
                  {block.suggestions.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#2b241c] bg-brand-black p-4"
                    >
                      <p className="font-black">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <BottomNav />
    </main>
  );
}
