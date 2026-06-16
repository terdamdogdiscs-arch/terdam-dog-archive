import Link from "next/link";
import { collectionSeed } from "../data/seed";
import { captions } from "../data/captions";
import { listeningPaths } from "../data/paths";
import BottomNav from "../components/BottomNav";
import FadeIn from "../components/FadeIn";
import CoverImage from "../components/CoverImage";
import { formatTotalDuration } from "../lib/discogs";

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

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
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
      </section>

      <section>
        {collectionSeed.map((album, index) => {
          const caption = captions[album.catalog];
          if (!caption) return null;

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

                  <p className="mt-3 text-base italic text-[#9d9079]">
                    {caption.ponte}
                  </p>

                  <p className="mt-4 text-2xl font-black text-brand-yellow leading-tight">
                    &ldquo;{caption.tese}&rdquo;
                  </p>
                </div>
              </Link>

              {index < collectionSeed.length - 1 && (
                <div className="flex justify-center my-3">
                  <span className="text-2xl text-brand-purple">↓</span>
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
