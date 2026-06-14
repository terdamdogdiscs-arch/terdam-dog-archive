"use client";

import Link from "next/link";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import FadeIn from "./components/FadeIn";
import { genreColor } from "./lib/genreColor";
import { albums } from "./data/albums";
import type { Album } from "./data/albums";
import {
  collectionSeed,
  collectionStats,
  collectionScore,
} from "./data/seed";

const exploreItems = [
  {
    label: "Jamaica",
    icon: "🌴",
    href: "/genre/reggae",
    description: "Roots, rocksteady e dub.",
  },
  {
    label: "Hip-Hop",
    icon: "🎤",
    href: "/genre/hip-hop",
    description: "Golden age, jazz rap e rua.",
  },
  {
    label: "Jazz",
    icon: "🎷",
    href: "/genre/jazz",
    description: "Fonte, improviso e ponte.",
  },
  {
    label: "Brasil",
    icon: "🇧🇷",
    href: "/genre/brasil",
    description: "Origem, retorno e visão global.",
  },
];

const listeningPaths = [
  {
    title: "Jamaica → NYC",
    description: "Da raiz jamaicana à arquitetura verbal do hip-hop.",
    catalogs: ["002", "007", "008", "010"],
    cover: "007",
  },
  {
    title: "Jazz Bridge",
    description: "Quando a batida encontra a linguagem do jazz.",
    catalogs: ["011", "013", "014", "016"],
    cover: "014",
  },
  {
    title: "Brasil Global",
    description: "O Brasil entrando e saindo da coleção por rotas internacionais.",
    catalogs: ["001", "019"],
    cover: "019",
  },
  {
    title: "De Kingston ao Bronx",
    description: "Do reggae jamaicano ao hip-hop, via Shinehead.",
    catalogs: ["002", "003", "004", "005", "006", "007", "008"],
    cover: "007",
  },
  {
    title: "A Era de Ouro",
    description: "O auge do golden age do hip-hop.",
    catalogs: ["008", "009", "010", "011", "012"],
    cover: "010",
  },
  {
    title: "Noite de Jazz",
    description: "Um set completo, do hard bop ao blues.",
    catalogs: ["013", "014", "015", "016", "017", "018"],
    cover: "016",
  },
  {
    title: "Raízes Brasileiras",
    description: "O Brasil entrando e saindo da coleção.",
    catalogs: ["001", "019", "020"],
    cover: "020",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const recordOfTheDay =
    collectionSeed[new Date().getDate() % collectionSeed.length];

  const mostValuable = [...collectionSeed].sort(
    (a, b) => b.financial.estimatedValue - a.financial.estimatedValue
  )[0];

  const filteredAlbums = collectionSeed.filter((album) => {
    const q = search.toLowerCase();

    return (
      album.catalog.toLowerCase().includes(q) ||
      album.artist.toLowerCase().includes(q) ||
      album.album.toLowerCase().includes(q) ||
      album.genre.toLowerCase().includes(q) ||
      album.country.toLowerCase().includes(q) ||
      album.role.toLowerCase().includes(q) ||
      album.story.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-4 pb-32">
      <section className="premium-card rounded-[2rem] border border-[#2b241c] bg-gradient-to-br from-[#17120d] to-[#080706] p-5 mb-5 overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Terdam Dog"
            className="h-[120px] w-[120px] rounded-full object-contain shadow-xl"
          />

          <div>
            <p className="text-xs tracking-[0.25em] text-purple-400">
              TERDAM DOG
            </p>

            <h1 className="text-3xl font-black leading-none mt-1">
              {albums[0].catalog} → {albums[albums.length - 1].catalog}
            </h1>

            <p className="text-sm text-[#b8aa91] mt-2">
              Jamaica, Nova York, jazz e Brasil em uma coleção viva.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <MiniStat value={collectionStats.totalAlbums} label="Discos" />
          <MiniStat value={collectionStats.countries.length} label="Países" />
          <MiniStat value={collectionStats.genres.length} label="Gêneros" />
        </div>

        <section className="premium-card mt-5 rounded-3xl border border-purple-800 bg-purple-950/20 p-4">
          <p className="text-xs tracking-[0.25em] text-purple-400">
            PONTUAÇÃO DA COLEÇÃO
          </p>

          <div className="flex items-end justify-between mt-2">
            <p className="text-5xl font-black text-brand-purple">
              {collectionScore}
              <span className="text-lg text-[#9d9079]">/100</span>
            </p>

            <Link href="/insights" className="text-sm text-purple-300">
              Ver insights →
            </Link>
          </div>
        </section>
      </section>

      <div className="h-px mb-4 bg-gradient-to-r from-brand-green to-brand-purple" />

      <input
        className="w-full mb-4 rounded-2xl border border-[#2b241c] bg-[#120f0b] p-4 text-[#f4ead8] outline-none focus:border-purple-500"
        placeholder="Pesquisar artista, disco, gênero, país..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <section className="mb-6">
        <p className="text-xs tracking-[0.25em] text-purple-400 mb-3">
          EXPLORAR
        </p>

        <div className="grid grid-cols-2 gap-3">
          {exploreItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="premium-card cursor-pointer rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 text-left transition hover:border-brand-yellow"
            >
              <p className="text-2xl">{item.icon}</p>
              <p className="font-black mt-2">{item.label}</p>
              <p className="text-xs text-[#9d9079] mt-1">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="premium-card rounded-[2rem] border border-yellow-700 bg-yellow-950/20 p-5 mb-6">
        <p className="text-yellow-400 text-xs tracking-[0.25em]">
          SELEÇÃO DO CURADOR
        </p>

        <div className="flex gap-4 mt-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#2b241c] bg-[#11100e]">
            <CoverImage album={recordOfTheDay} />
          </div>

          <div>
            <p className="text-purple-400 text-sm">
              TD-{recordOfTheDay.catalog}
            </p>

            <h2 className="text-2xl font-black leading-tight">
              {recordOfTheDay.artist}
            </h2>

            <p className="text-sm text-[#b8aa91] mt-1">
              {recordOfTheDay.album}
            </p>

            <p className="text-xs text-[#9d9079] mt-2">
              {recordOfTheDay.story}
            </p>

            <Link
              href={`/album/${recordOfTheDay.catalog}`}
              className="inline-block mt-3 text-yellow-300 text-sm"
            >
              Abrir história →
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px my-6 bg-gradient-to-r from-brand-green to-brand-purple" />

      <section className="premium-card rounded-[2rem] border border-green-800 bg-green-950/10 p-5 mb-7">
        <p className="text-green-400 text-xs tracking-[0.25em]">
          VALOR DA COLEÇÃO
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <MiniStat
            value={`R$ ${collectionStats.totalEstimatedValue}`}
            label="Valor estimado"
          />

          <MiniStat
            value={`TD-${mostValuable.catalog}`}
            label="Mais valioso"
          />
        </div>

        <Link href="/vault" className="inline-block mt-4 text-sm text-green-300">
          Abrir Cofre →
        </Link>
      </section>

      <div className="h-px mb-6 bg-gradient-to-r from-brand-green to-brand-purple" />

      <section className="mb-7">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs tracking-[0.25em] text-purple-400">
              JORNADAS DE ESCUTA
            </p>

            <h2 className="text-2xl font-black">Caminhos de escuta</h2>
          </div>

          <Link href="/narrative" className="text-sm text-purple-400">
            Narrativa →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {listeningPaths.map((path, index) => {
            const cover = collectionSeed.find(
              (item) => item.catalog === path.cover
            );

            if (!cover) return null;

            return (
              <FadeIn
                key={path.title}
                delay={index * 80}
                className="min-w-[240px]"
              >
                <Link
                  href="/journey"
                  className="premium-card flex gap-3 rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 hover:border-purple-500 transition"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2b241c] bg-brand-black">
                    <CoverImage album={cover} />
                  </div>

                  <div>
                    <p className="font-black leading-tight">{path.title}</p>

                    <p className="text-xs text-[#9d9079] mt-1">
                      {path.description}
                    </p>

                    <p className="text-xs text-purple-400 mt-2">
                      {path.catalogs.length} discos
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <div className="h-px mb-6 bg-gradient-to-r from-brand-green to-brand-purple" />

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-purple-400">
              COLEÇÃO
            </p>

            <h2 className="text-4xl font-black text-brand-yellow">
              {albums.length} discos
            </h2>
          </div>

          <Link href="/discover" className="text-sm text-purple-400">
            Descobrir →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredAlbums.map((album, index) => (
            <FadeIn key={album.catalog} delay={Math.min(index * 40, 320)}>
              <Link href={`/album/${album.catalog}`} className="group block">
                <div className="premium-card aspect-square rounded-3xl border border-[#2b241c] bg-[#11100e] overflow-hidden group-hover:border-purple-500 transition">
                  <CoverImage album={album} />
                </div>

                <div className="mt-2">
                  <p className="text-purple-400 text-xs">
                    TD-{album.catalog}
                  </p>

                  <h3 className="font-black leading-tight text-sm">
                    {album.artist}
                  </h3>

                  <p className="text-xs text-[#b8aa91] line-clamp-2">
                    {album.album}
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
        </div>
      </section>

      <footer className="mt-10 mb-4 text-center">
        <p className="text-[10px] tracking-[0.3em] text-[#9d9079]">
          EST. 2026 · BRASIL · VINYL COLLECTOR · ANTIFA · 174 BPM
        </p>

        <div className="mt-3 flex items-center justify-center gap-5">
          <a
            href="https://instagram.com/terdamdogdiscs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#9d9079] transition hover:text-brand-yellow"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>

          <a
            href="https://open.spotify.com/user/31arerzcinbp6p42ubzthec4mtvq?si=NiySpF3pSRq7bTeFlpbGzg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Spotify"
            className="text-[#9d9079] transition hover:text-brand-yellow"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 9.5 16 12 9 14.5z" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </footer>

      <BottomNav />
    </main>
  );
}

function CoverImage({
  album,
}: {
  album: Pick<Album, "catalog" | "album" | "artist" | "cover">;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#18130e] to-[#070707] p-3 text-center">
        <p className="text-lg font-black text-purple-400">
          TD-{album.catalog}
        </p>

        <p className="mt-1 text-[10px] text-[#9d9079]">
          {album.artist}
        </p>
      </div>
    );
  }

  return (
    <img
      src={album.cover}
      alt={album.album}
      className="h-full w-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

function MiniStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2b241c] bg-[#11100e] p-3 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[11px] text-[#9d9079]">{label}</p>
    </div>
  );
}