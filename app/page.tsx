"use client";

import Link from "next/link";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import {
  collectionSeed,
  collectionStats,
  collectionScore,
} from "./data/seed";

const exploreItems = [
  {
    label: "Jamaica",
    icon: "🌴",
    query: "Reggae",
    description: "Roots, rocksteady e diáspora.",
  },
  {
    label: "Hip-Hop",
    icon: "🎤",
    query: "Hip-Hop",
    description: "Golden age, jazz rap e rua.",
  },
  {
    label: "Jazz",
    icon: "🎷",
    query: "Jazz",
    description: "Fonte, improviso e ponte.",
  },
  {
    label: "Brasil",
    icon: "🇧🇷",
    query: "Brasil",
    description: "Origem, retorno e visão global.",
  },
];

const listeningPaths = [
  {
    title: "Jamaica → NYC",
    description: "Da raiz jamaicana à arquitetura verbal do hip-hop.",
    catalogs: ["002", "007", "008", "010"],
  },
  {
    title: "Jazz Bridge",
    description: "Quando a batida encontra a linguagem do jazz.",
    catalogs: ["011", "013", "014", "016"],
  },
  {
    title: "Brasil Global",
    description: "O Brasil entrando e saindo da coleção por rotas internacionais.",
    catalogs: ["001", "019", "013"],
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const recordOfTheDay =
    collectionSeed[new Date().getDate() % collectionSeed.length];

  const mostValuable = [...collectionSeed].sort(
    (a, b) => b.financial.estimatedValue - a.financial.estimatedValue
  )[0];

  const filteredAlbums = collectionSeed.filter((album) => {
    const q = search.toLowerCase();

    const matchesSearch =
      album.catalog.toLowerCase().includes(q) ||
      album.artist.toLowerCase().includes(q) ||
      album.album.toLowerCase().includes(q) ||
      album.genre.toLowerCase().includes(q) ||
      album.country.toLowerCase().includes(q) ||
      album.role.toLowerCase().includes(q) ||
      album.story.toLowerCase().includes(q);

    const matchesFilter =
      activeFilter === "Todos" ||
      album.genre.toLowerCase().includes(activeFilter.toLowerCase()) ||
      album.country.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  function applyExplore(query: string) {
    setActiveFilter(query);
    setSearch("");
  }

  return (
    <main className="min-h-screen bg-[#070707] text-[#f4ead8] p-4 pb-32">
      <section className="rounded-[2rem] border border-[#2b241c] bg-gradient-to-br from-[#17120d] to-[#080706] p-5 mb-5 overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Terdam Dog"
            className="h-16 w-16 rounded-full object-cover shadow-xl"
          />

          <div>
            <p className="text-xs tracking-[0.25em] text-purple-400">
              TERDAM DOG
            </p>

            <h1 className="text-3xl font-black leading-none mt-1">
              001 → 019
            </h1>

            <p className="text-sm text-[#b8aa91] mt-2">
              Jamaica, Nova York, jazz e Brasil em uma coleção viva.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <MiniStat value={collectionStats.totalAlbums} label="Records" />
          <MiniStat value={collectionStats.countries.length} label="Countries" />
          <MiniStat value={collectionStats.genres.length} label="Genres" />
        </div>

        <section className="mt-5 rounded-3xl border border-purple-800 bg-purple-950/20 p-4">
          <p className="text-xs tracking-[0.25em] text-purple-400">
            COLLECTION SCORE
          </p>

          <div className="flex items-end justify-between mt-2">
            <p className="text-4xl font-black">
              {collectionScore}
              <span className="text-lg text-[#9d9079]">/100</span>
            </p>

            <Link href="/insights" className="text-sm text-purple-300">
              Ver insights →
            </Link>
          </div>
        </section>
      </section>

      <input
        className="w-full mb-4 rounded-2xl border border-[#2b241c] bg-[#120f0b] p-4 text-[#f4ead8] outline-none focus:border-purple-500"
        placeholder="Pesquisar artista, disco, gênero, país..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setActiveFilter("Todos");
        }}
      />

      <section className="mb-6">
        <p className="text-xs tracking-[0.25em] text-purple-400 mb-3">
          EXPLORE
        </p>

        <div className="grid grid-cols-2 gap-3">
          {exploreItems.map((item) => (
            <button
              key={item.label}
              onClick={() => applyExplore(item.query)}
              className={`rounded-3xl border p-4 text-left transition ${
                activeFilter === item.query
                  ? "border-purple-500 bg-purple-950/30"
                  : "border-[#2b241c] bg-[#11100e]"
              }`}
            >
              <p className="text-2xl">{item.icon}</p>
              <p className="font-black mt-2">{item.label}</p>
              <p className="text-xs text-[#9d9079] mt-1">{item.description}</p>
            </button>
          ))}
        </div>

        {activeFilter !== "Todos" && (
          <button
            onClick={() => {
              setActiveFilter("Todos");
              setSearch("");
            }}
            className="mt-3 text-sm text-purple-400"
          >
            Limpar exploração
          </button>
        )}
      </section>

      <section className="rounded-[2rem] border border-yellow-700 bg-yellow-950/20 p-5 mb-6">
        <p className="text-yellow-400 text-xs tracking-[0.25em]">
          CURATOR&apos;S PICK
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

      <section className="rounded-[2rem] border border-green-800 bg-green-950/10 p-5 mb-7">
        <p className="text-green-400 text-xs tracking-[0.25em]">
          PRIVATE VALUE SNAPSHOT
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
          Abrir Vault →
        </Link>
      </section>

      <section className="mb-7">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs tracking-[0.25em] text-purple-400">
              LISTENING PATHS
            </p>

            <h2 className="text-2xl font-black">Caminhos de escuta</h2>
          </div>

          <Link href="/narrative" className="text-sm text-purple-400">
            Story →
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {listeningPaths.map((path) => (
            <Link
              key={path.title}
              href="/narrative"
              className="min-w-[260px] rounded-3xl border border-[#2b241c] bg-[#11100e] p-4"
            >
              <p className="text-xl font-black">{path.title}</p>

              <p className="text-sm text-[#b8aa91] mt-2">
                {path.description}
              </p>

              <div className="mt-4 flex gap-2">
                {path.catalogs.map((catalog) => {
                  const album = collectionSeed.find(
                    (item) => item.catalog === catalog
                  );

                  if (!album) return null;

                  return (
                    <div
                      key={catalog}
                      className="h-12 w-12 overflow-hidden rounded-xl border border-[#2b241c] bg-[#080706]"
                    >
                      <CoverImage album={album} />
                    </div>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-purple-400">
              COLLECTION
            </p>

            <h2 className="text-3xl font-black">
              {filteredAlbums.length} discos
            </h2>
          </div>

          <Link href="/discover" className="text-sm text-purple-400">
            Discover →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredAlbums.map((album) => (
            <Link
              key={album.catalog}
              href={`/album/${album.catalog}`}
              className="group block"
            >
              <div className="aspect-square rounded-3xl border border-[#2b241c] bg-[#11100e] overflow-hidden group-hover:border-purple-500 transition">
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

                <p className="text-[11px] text-[#9d9079] mt-1">
                  {album.genre}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

function CoverImage({ album }: { album: any }) {
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