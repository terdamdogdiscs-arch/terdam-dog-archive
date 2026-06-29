"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BottomNav from "./components/BottomNav";
import CoverImage from "./components/CoverImage";
import FadeIn from "./components/FadeIn";
import { albums } from "./data/albums";
import { listeningPaths } from "./data/paths";
import { collectionSeed, collectionStats, collectionScore } from "./data/seed";
import { formatTotalDuration } from "./lib/discogs";
import { genreColor } from "./lib/genreColor";
import { generateJourneyPhrase } from "./lib/narrative";

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

const architectureItems = [
  {
    title: "História",
    description: "A sequência que conecta um disco ao próximo.",
    href: "/journey",
    accent: "border-brand-green",
  },
  {
    title: "Descoberta",
    description: "Lacunas reais e próximos caminhos para o acervo.",
    href: "/discover",
    accent: "border-brand-purple",
  },
  {
    title: "Ensaio",
    description: "As ideias que sustentam a coleção.",
    href: "/essay",
    accent: "border-brand-red",
  },
  {
    title: "Dados",
    description: "Décadas, territórios, duração e visualizações.",
    href: "/insights",
    accent: "border-brand-yellow",
  },
];

const currentCollectionWeek = Math.floor(
  Date.now() / (7 * 24 * 60 * 60 * 1000)
);

export default function Home() {
  const [search, setSearch] = useState("");
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const journeyPhrase = generateJourneyPhrase(albums);
  const recordOfTheWeek =
    collectionSeed[currentCollectionWeek % collectionSeed.length];

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
        .slice(0, 6)
    : [];

  const visibleAlbums = showAllAlbums
    ? collectionSeed
    : collectionSeed.slice(0, 12);
  const visiblePaths = showAllPaths ? listeningPaths : listeningPaths.slice(0, 4);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="wide-page min-h-screen bg-brand-black p-4 text-[#f4ead8] sm:p-6 lg:px-8">
      <section className="premium-card mb-6 overflow-hidden rounded-[2rem] border border-[#2b241c] bg-gradient-to-br from-[#17120d] to-[#080706] p-5 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:gap-8 lg:p-8">
        <div>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Terdam Dog"
              className="h-24 w-24 rounded-full object-contain shadow-xl sm:h-[120px] sm:w-[120px]"
            />

            <div>
              <p className="text-sm tracking-[0.25em] text-purple-300">
                TERDAM DOG
              </p>
              <h1 className="mt-1 text-3xl font-black leading-none sm:text-5xl">
                {albums[0].catalog} → {albums[albums.length - 1].catalog}
              </h1>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat value={collectionStats.totalAlbums} label="Discos" />
            <MiniStat value={collectionStats.countries.length} label="Países" />
            <MiniStat value={collectionStats.decades.length} label="Décadas" />
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between rounded-3xl border border-purple-700 bg-purple-950/20 p-5 lg:mt-0">
          <div>
            <p className="text-sm tracking-[0.22em] text-purple-300">
              LEITURA DA COLEÇÃO
            </p>
            <p className="mt-2 text-5xl font-black text-purple-300">
              {collectionScore}
              <span className="text-lg text-[#9d9079]">/100</span>
            </p>
            <p className="mt-2 text-sm text-[#b8aa91]">
              Um retrato da diversidade atual do arquivo.
            </p>
          </div>

          <Link
            href="/insights"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-purple-500 px-5 text-sm text-purple-200 transition hover:bg-purple-900/30"
          >
            Explorar os dados →
          </Link>
        </div>
      </section>

      <div ref={searchRef} className="relative z-20 mb-6">
        <label
          htmlFor="collection-search"
          className="mb-2 block text-sm tracking-[0.2em] text-purple-300"
        >
          BUSCAR NA COLEÇÃO
        </label>
        <div className="flex gap-2">
          <input
            id="collection-search"
            className="min-w-0 flex-1 rounded-2xl border border-[#2b241c] bg-[#120f0b] p-4 text-[#f4ead8] outline-none focus:border-purple-400"
            placeholder="Artista, disco, gênero, país..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-2xl border border-[#2b241c] px-4 text-sm text-[#b8aa91]"
              aria-label="Limpar busca"
            >
              Limpar
            </button>
          )}
        </div>

        {search.trim() && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-purple-600 bg-[#171411] shadow-2xl">
            <p className="border-b border-[#2b241c] px-4 py-2 text-sm text-[#9d9079]">
              {dropdownResults.length > 0
                ? `${dropdownResults.length} resultado${dropdownResults.length === 1 ? "" : "s"}`
                : "Nenhum disco encontrado"}
            </p>

            {dropdownResults.map((album) => (
              <Link
                key={album.catalog}
                href={`/album/${album.catalog}`}
                onClick={() => setSearch("")}
                className="flex min-h-14 items-center gap-3 px-4 py-3 transition hover:bg-[#23201b]"
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#2b241c]">
                  <CoverImage album={album} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{album.artist}</p>
                  <p className="truncate text-sm text-[#9d9079]">
                    {album.album} · {album.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="mb-8">
        <p className="mb-3 text-sm tracking-[0.22em] text-purple-300">
          EXPLORAR POR SOM
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {exploreItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="premium-card rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 transition hover:border-brand-yellow"
            >
              <p className="text-2xl" aria-hidden="true">{item.icon}</p>
              <p className="mt-2 font-black">{item.label}</p>
              <p className="mt-1 text-sm text-[#9d9079]">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <p className="text-sm tracking-[0.22em] text-purple-300">
            ESCOLHA SEU CAMINHO
          </p>
          <h2 className="mt-1 text-3xl font-black">Quatro portas de entrada.</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {architectureItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`rounded-3xl border border-l-4 ${item.accent} bg-[#11100e] p-5 transition hover:-translate-y-0.5`}
            >
              <p className="text-xl font-black">{item.title}</p>
              <p className="mt-2 text-sm text-[#b8aa91]">{item.description}</p>
              <p className="mt-4 text-sm text-purple-300">Abrir →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="premium-card mb-8 rounded-[2rem] border border-yellow-700 bg-yellow-950/15 p-5 lg:flex lg:items-center lg:gap-6">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#2b241c] bg-[#11100e]">
          <CoverImage album={recordOfTheWeek} />
        </div>

        <div className="mt-4 lg:mt-0">
          <p className="text-sm tracking-[0.22em] text-yellow-400">
            DISCO DA SEMANA · TD-{recordOfTheWeek.catalog}
          </p>
          <h2 className="mt-2 text-3xl font-black">{recordOfTheWeek.artist}</h2>
          <p className="text-[#b8aa91]">{recordOfTheWeek.album}</p>
          <p className="mt-2 max-w-2xl text-sm text-[#9d9079]">
            {recordOfTheWeek.story}
          </p>
          <Link
            href={`/album/${recordOfTheWeek.catalog}`}
            className="mt-4 inline-block text-sm text-yellow-300"
          >
            Abrir história →
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.22em] text-purple-300">
              JORNADAS DE ESCUTA
            </p>
            <h2 className="mt-1 text-3xl font-black">Caminhos curados.</h2>
          </div>
          <Link href="/narrative" className="text-sm text-purple-300">
            Ver narrativa →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visiblePaths.map((path, index) => {
            const cover = collectionSeed.find((item) => item.catalog === path.cover);
            if (!cover) return null;

            const duration = path.catalogs.reduce((sum, catalog) => {
              const item = collectionSeed.find((entry) => entry.catalog === catalog);
              return sum + (item?.totalDurationSeconds || 0);
            }, 0);

            return (
              <FadeIn key={path.slug} delay={index * 50}>
                <Link
                  href={`/journey?trilha=${path.slug}`}
                  className="premium-card flex h-full min-h-36 gap-3 rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 transition hover:border-purple-500"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <CoverImage album={cover} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="font-black leading-tight">{path.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-[#9d9079]">
                        {path.description}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-purple-300">
                      {duration > 0 && `${formatTotalDuration(duration)} · `}
                      {path.catalogs.length} discos
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        {listeningPaths.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAllPaths((value) => !value)}
            className="mt-4 min-h-11 rounded-full border border-[#3a3025] px-5 text-sm text-[#b8aa91]"
          >
            {showAllPaths ? "Mostrar menos jornadas" : "Ver todas as jornadas"}
          </button>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.22em] text-purple-300">COLEÇÃO</p>
            <h2 className="mt-1 text-4xl font-black text-brand-yellow">
              {albums.length} discos
            </h2>
          </div>
          <Link href="/coming" className="text-sm text-purple-300">
            Ver acervo →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visibleAlbums.map((album, index) => (
            <FadeIn key={album.catalog} delay={Math.min(index * 35, 245)}>
              <Link href={`/album/${album.catalog}`} className="group block">
                <div className="premium-card aspect-square overflow-hidden rounded-3xl border border-[#2b241c] bg-[#11100e] transition group-hover:border-purple-500">
                  <CoverImage album={album} />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-purple-300">TD-{album.catalog}</p>
                  <h3 className="text-base font-black leading-tight">{album.artist}</h3>
                  <p className="line-clamp-2 text-sm text-[#b8aa91]">{album.album}</p>
                  <span
                    className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs tracking-wide ${genreColor(album.genre).border} ${genreColor(album.genre).text}`}
                  >
                    {album.genre}
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {!showAllAlbums && (
          <button
            type="button"
            onClick={() => setShowAllAlbums(true)}
            className="mt-6 min-h-12 w-full rounded-2xl border border-brand-purple px-5 text-sm text-purple-200 transition hover:bg-purple-950/30 sm:w-auto"
          >
            Ver os {albums.length} discos
          </button>
        )}
      </section>

      <footer className="mt-12 border-t border-[#2b241c] pt-6 text-center">
        <Link href="/vault" className="text-sm text-purple-300">
          Abrir cofre privado →
        </Link>
        <p className="mt-4 text-xs tracking-[0.2em] text-[#9d9079]">
          EST. 2026 · BRASIL · VINYL COLLECTOR · ANTIFA · 174 BPM
        </p>
      </footer>

      <BottomNav />
    </main>
  );
}

function MiniStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-[#2b241c] bg-[#11100e] p-3 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-sm text-[#9d9079]">{label}</p>
    </div>
  );
}
