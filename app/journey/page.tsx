import Link from "next/link";
import { collectionSeed } from "../data/seed";
import { captions } from "../data/captions";
import { listeningPaths } from "../data/paths";
import BottomNav from "../components/BottomNav";
import FadeIn from "../components/FadeIn";
import CoverImage from "../components/CoverImage";
import JourneyNav from "../components/JourneyNav";
import { formatTotalDuration } from "../lib/discogs";

type SeedAlbum = (typeof collectionSeed)[number];

// Categoria de cada disco: papéis especiais (role) têm prioridade; os demais
// são agrupados por bloco de gênero/região via faixa de catalog.
const categoryOf = (album: SeedAlbum) => {
  if (album.role === "Referência") return "referencias";
  if (album.role === "Virada") return "virada";
  if (album.role === "Família Marley") return "familia-marley";

  const c = album.catalog;
  if (c === "001") return "origem";
  if (c >= "002" && c <= "007") return "reggae";
  if (c >= "008" && c <= "012") return "hip-hop";
  if (c >= "014" && c <= "018") return "jazz";
  if (c >= "020" && c <= "024") return "jorge-ben";
  return "principal";
};

const NAV_META = [
  { id: "origem", title: "Origem Brasil", icon: "🌅", border: "border-rose-800", text: "text-rose-400" },
  { id: "reggae", title: "Bloco Reggae", icon: "🌴", border: "border-green-800", text: "text-green-400" },
  { id: "hip-hop", title: "Bloco Hip-Hop", icon: "🎤", border: "border-purple-700", text: "text-purple-400" },
  { id: "virada", title: "Viradas", icon: "↔", border: "border-red-800", text: "text-red-400" },
  { id: "jazz", title: "Bloco Jazz", icon: "🎷", border: "border-blue-800", text: "text-blue-400" },
  { id: "jorge-ben", title: "Bloco Jorge Ben", icon: "🎸", border: "border-orange-700", text: "text-orange-400" },
  { id: "referencias", title: "Referências", icon: "◆", border: "border-yellow-700", text: "text-yellow-400" },
  { id: "familia-marley", title: "Família Marley", icon: "🌿", border: "border-teal-700", text: "text-teal-400" },
];

export default async function JourneyPage({
  searchParams,
}: {
  searchParams: Promise<{ trilha?: string }>;
}) {
  const { trilha } = await searchParams;

  const activePath = trilha
    ? listeningPaths.find((p) => p.slug === trilha)
    : undefined;

  if (activePath) {
    const pathAlbums = activePath.catalogs
      .map((cat) => collectionSeed.find((a) => a.catalog === cat))
      .filter((a): a is NonNullable<typeof a> => !!a);

    const totalDuration = pathAlbums.reduce(
      (sum, a) => sum + (a.totalDurationSeconds || 0),
      0
    );

    return (
      <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
        <Link href="/journey" className="text-purple-400">
          ← Todas as Jornadas
        </Link>

        <section className="mt-8 mb-10">
          <p className="text-sm tracking-[0.35em] text-purple-400">
            JORNADA DE ESCUTA
          </p>

          <h1 className="text-5xl font-black mt-3 leading-none">
            {activePath.title}
          </h1>

          <p className="text-[#b8aa91] mt-4">{activePath.description}</p>

          <p className="text-xs text-purple-400 mt-3">
            {pathAlbums.length} {pathAlbums.length === 1 ? "disco" : "discos"}
            {totalDuration > 0 && ` · ${formatTotalDuration(totalDuration)}`}
          </p>
        </section>

        <section>
          {pathAlbums.map((album, index) => {
            const caption = captions[album.catalog];

            return (
              <FadeIn key={album.catalog}>
                <Link
                  href={`/album/${album.catalog}`}
                  className="flex gap-4 rounded-3xl border border-[#2b241c] bg-[#11100e] p-5 hover:border-purple-500 transition"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#2b241c] bg-brand-black">
                    <CoverImage album={album} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-purple-400">
                      TD-{album.catalog} · {album.artist} — {album.album}
                    </p>

                    {caption && (
                      <>
                        <p className="mt-3 text-base italic text-[#9d9079]">
                          {caption.ponte}
                        </p>

                        <p className="mt-4 text-2xl font-black text-brand-yellow leading-tight">
                          &ldquo;{caption.tese}&rdquo;
                        </p>
                      </>
                    )}
                  </div>
                </Link>

                {index < pathAlbums.length - 1 && (
                  <div className="flex justify-center my-3">
                    <span className="text-2xl text-brand-purple">↓</span>
                  </div>
                )}
              </FadeIn>
            );
          })}
        </section>

        <BottomNav />
      </main>
    );
  }

  const navItems = NAV_META.map((meta) => {
    const cats = collectionSeed
      .filter((a) => categoryOf(a) === meta.id)
      .map((a) => a.catalog)
      .sort();

    const range =
      cats.length === 0
        ? "—"
        : cats.length <= 3
        ? cats.join(" · ")
        : `${cats[0]}–${cats[cats.length - 1]}`;

    return { ...meta, count: cats.length, range };
  }).filter((item) => item.count > 0);

  // A primeira ocorrência (na ordem de exibição) de cada categoria recebe a âncora.
  const anchorForCatalog: Record<string, string> = {};
  const seenCategories = new Set<string>();
  collectionSeed.forEach((album) => {
    const cat = categoryOf(album);
    if (!seenCategories.has(cat)) {
      seenCategories.add(cat);
      anchorForCatalog[album.catalog] = cat;
    }
  });

  return (
    <main className="reading-page min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">← Coleção</Link>

      <section className="mt-8 mb-10">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          JORNADA DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          Um disco leva ao próximo.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Uma jornada em andamento — {collectionSeed.length} capítulos e contando.
        </p>

        <JourneyNav items={navItems} />
      </section>

      <section>
        {collectionSeed.map((album, index) => {
          const caption = captions[album.catalog];
          if (!caption) return null;

          const isRef = album.role === "Referência";
          const nextAlbumInList = collectionSeed[index + 1];
          const nextIsRef = nextAlbumInList?.role === "Referência";
          const anchorId = anchorForCatalog[album.catalog];

          return (
            <FadeIn key={album.catalog}>
              <div id={anchorId || undefined} className={anchorId ? "scroll-mt-24" : undefined}>
              <Link
                href={`/album/${album.catalog}`}
                className={`flex gap-4 rounded-3xl border bg-[#11100e] p-5 transition ${
                  isRef
                    ? "border-yellow-700 hover:border-yellow-500"
                    : "border-[#2b241c] hover:border-purple-500"
                }`}
              >
                <div
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-brand-black ${
                    isRef ? "border-yellow-700" : "border-[#2b241c]"
                  }`}
                >
                  <CoverImage album={album} />
                </div>

                <div className="flex-1">
                  {isRef && (
                    <p className="text-xs tracking-[0.25em] text-yellow-500 mb-1">
                      ◆ REFERÊNCIA
                    </p>
                  )}

                  <p className={`text-sm ${isRef ? "text-yellow-400" : "text-purple-400"}`}>
                    TD-{album.catalog} · {album.artist} — {album.album}
                  </p>

                  <p className="mt-3 text-base italic text-[#9d9079]">
                    {caption.ponte}
                  </p>

                  <p className="mt-4 text-2xl font-black text-brand-yellow leading-tight">
                    &ldquo;{caption.tese}&rdquo;
                  </p>
                </div>
              </Link>
              </div>

              {index < collectionSeed.length - 1 && (
                <div className="flex justify-center my-3">
                  {nextIsRef || isRef ? (
                    <span className="text-xl text-yellow-700">◆</span>
                  ) : (
                    <span className="text-2xl text-brand-purple">↓</span>
                  )}
                </div>
              )}
            </FadeIn>
          );
        })}
      </section>

      <section className="mt-10 mb-4 text-center">
        <Link
          href="/heatmap"
          className="inline-block rounded-full border border-purple-700 px-5 py-2 text-purple-400"
        >
          Ver mapa de calor da coleção →
        </Link>
      </section>

      <BottomNav />
    </main>
  );
}
