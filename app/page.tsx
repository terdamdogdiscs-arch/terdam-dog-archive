"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import FadeIn from "./components/FadeIn";
import { genreColor } from "./lib/genreColor";
import { albums } from "./data/albums";
import type { Album } from "./data/albums";
import { formatTotalDuration } from "./lib/discogs";
import { generateJourneyPhrase } from "./lib/narrative";
import { listeningPaths } from "./data/paths";
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


export default function Home() {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const journeyPhrase = generateJourneyPhrase(albums);

  const week = Math.floor(new Date().getTime() / (7 * 24 * 60 * 60 * 1000));
  const recordOfTheDay = collectionSeed[week % collectionSeed.length];

  const dropdownResults = search.trim()
    ? collectionSeed
        .filter((album) => {
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
        })
        .slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              {journeyPhrase}
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

      <div ref={searchRef} className="relative mb-4">
        <input
          className="w-full rounded-2xl border border-[#2b241c] bg-[#120f0b] p-4 text-[#f4ead8] outline-none focus:border-purple-500"
          placeholder="Pesquisar artista, disco, gênero, país..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {search.trim() && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-brand-purple bg-[#1a1a1a] shadow-xl">
            {dropdownResults.length > 0 ? (
              dropdownResults.map((album) => (
                <Link
                  key={album.catalog}
                  href={`/album/${album.catalog}`}
                  onClick={() => setSearch("")}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#232323]"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#2b241c]">
                    <CoverImage album={album} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight">
                      {album.artist}
                    </p>

                    <p className="truncate text-xs text-[#9d9079]">
                      {album.album} · {album.year}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-4 py-4 text-sm text-[#9d9079]">
                Nenhum disco encontrado.
              </p>
            )}
          </div>
        )}
      </div>

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

      <div className="mb-7">
        <Link href="/vault" className="text-sm text-purple-400">
          Abrir cofre →
        </Link>
      </div>

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

        <div className="flex items-stretch gap-3 overflow-x-auto pb-1">
          {listeningPaths.map((path, index) => {
            const cover = collectionSeed.find(
              (item) => item.catalog === path.cover
            );

            if (!cover) return null;

            const pathDuration = path.catalogs.reduce((sum, catalog) => {
              const item = collectionSeed.find((entry) => entry.catalog === catalog);
              return sum + (item?.totalDurationSeconds || 0);
            }, 0);

            return (
              <FadeIn
                key={path.title}
                delay={index * 80}
                className="min-w-[240px] max-w-[240px] self-stretch"
              >
                <Link
                  href={`/journey?trilha=${path.slug}`}
                  className="premium-card flex h-36 gap-3 rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 hover:border-purple-500 transition"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2b241c] bg-brand-black">
                    <CoverImage album={cover} />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="font-black leading-tight line-clamp-2">
                        {path.title}
                      </p>

                      <p className="text-xs text-[#9d9079] mt-1 line-clamp-2">
                        {path.description}
                      </p>
                    </div>

                    <p className="text-xs text-purple-400 mt-2">
                      {pathDuration > 0
                        ? `${formatTotalDuration(pathDuration)} · ${path.catalogs.length} discos`
                        : `${path.catalogs.length} discos`}
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
          {collectionSeed.map((album, index) => (
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