"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { collectionSeed } from "../../data/seed";
import { genreColor } from "../../lib/genreColor";
import BottomNav from "../../components/BottomNav";
import FadeIn from "../../components/FadeIn";
import CoverImage from "../../components/CoverImage";
import { formatTotalDuration } from "../../lib/discogs";

const GENRES: Record<
  string,
  {
    title: string;
    description: string;
    filter: (album: (typeof collectionSeed)[number]) => boolean;
  }
> = {
  reggae: {
    title: "REGGAE",
    description: "Roots, rocksteady, dub e a herança jamaicana na coleção.",
    filter: (album) => album.genre.toLowerCase().includes("reggae"),
  },
  "hip-hop": {
    title: "HIP-HOP",
    description: "Golden age, jazz rap e a palavra como arquitetura.",
    filter: (album) => album.genre.toLowerCase().includes("hip-hop"),
  },
  jazz: {
    title: "JAZZ",
    description: "Da fonte ao improviso, o bloco jazz da coleção.",
    filter: (album) => album.genre.toLowerCase().includes("jazz"),
  },
  brasil: {
    title: "BRASIL",
    description: "Origem, retorno e a visão global do Brasil na coleção.",
    filter: (album) => album.country.toLowerCase().includes("brasil"),
  },
};

export default function GenrePage() {
  const params = useParams();
  const slug = String(params.slug);

  const genre = GENRES[slug];

  if (!genre) {
    return (
      <main className="min-h-screen bg-brand-black text-[#f4ead8] p-6 pb-32">
        <Link href="/" className="text-purple-400">
          ← Coleção
        </Link>

        <h1 className="text-3xl font-black mt-8">Gênero não encontrado</h1>

        <BottomNav />
      </main>
    );
  }

  const filteredAlbums = collectionSeed.filter(genre.filter);

  const totalDuration = filteredAlbums.reduce(
    (sum, album) => sum + (album.totalDurationSeconds || 0),
    0
  );

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-4 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-6">
        <p className="text-sm tracking-[0.35em] text-purple-400">EXPLORAR</p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          {genre.title}
        </h1>

        <p className="text-[#b8aa91] mt-5">{genre.description}</p>

        <p className="text-xs text-purple-400 mt-2">
          {filteredAlbums.length} discos
          {totalDuration > 0 && ` · ${formatTotalDuration(totalDuration)} de música`}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {filteredAlbums.map((album, index) => (
          <FadeIn key={album.catalog} delay={Math.min(index * 40, 320)}>
            <Link href={`/album/${album.catalog}`} className="group block">
              <div className="premium-card relative aspect-square rounded-3xl border border-[#2b241c] bg-[#11100e] overflow-hidden group-hover:border-purple-500 transition">
                <CoverImage album={album} />

                {!!album.totalDurationSeconds && (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-[#f4ead8]">
                    {formatTotalDuration(album.totalDurationSeconds)}
                  </span>
                )}
              </div>

              <div className="mt-2">
                <p className="text-purple-400 text-xs">TD-{album.catalog}</p>

                <h3 className="font-black leading-tight text-sm">
                  {album.artist}
                </h3>

                <p className="text-xs text-[#b8aa91] line-clamp-2">
                  {album.album} ({album.year})
                </p>

                <span
                  className={`inline-block mt-2 rounded-full border px-2.5 py-1 text-[10px] tracking-wider ${genreColor(album.genre).border} ${genreColor(album.genre).text}`}
                >
                  {album.genre}
                </span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </section>

      {totalDuration > 0 && (
        <p className="mt-6 text-center text-sm tracking-[0.2em] text-[#9d9079]">
          TEMPO TOTAL DE ESCUTA DESTE BLOCO ·{" "}
          <span className="font-bold text-brand-yellow">
            {formatTotalDuration(totalDuration)}
          </span>
        </p>
      )}

      <BottomNav />
    </main>
  );
}
