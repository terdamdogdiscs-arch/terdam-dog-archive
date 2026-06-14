"use client";

import BottomNav from "../components/BottomNav";
import Link from "next/link";
import { useState } from "react";
import { albums } from "../data/albums";
import { tracks } from "../data/tracks";

export default function Home() {
  const [search, setSearch] = useState("");

  const totalTracks = tracks.length;
  const lastAlbum = albums[albums.length - 1];

  const filteredAlbums = albums.filter((album) => {
    const q = search.toLowerCase();

    return (
      album.catalog.toLowerCase().includes(q) ||
      album.artist.toLowerCase().includes(q) ||
      album.album.toLowerCase().includes(q) ||
      album.genre.toLowerCase().includes(q) ||
      album.role.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-brand-black text-[#f5ead2] p-6 pb-24">
      <section className="mb-10">
        <p className="text-sm text-purple-400 mb-2">TERDAM DOG ARCHIVE</p>

        <h1 className="text-5xl font-black leading-tight">
          Uma coleção viva contada disco por disco.
        </h1>

        <p className="text-[#c7bda8] mt-4">
          Coleção #000 — Uma narrativa em expansão
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <Stat title="Discos" value={albums.length} color="border-green-500" />
        <Stat title="Faixas" value={totalTracks} color="border-yellow-500" />
        <Stat title="Duração" value="~15h11m" color="border-red-500" />
        <Stat title="Países" value="4" color="border-purple-500" />
      </section>

      <section className="border border-purple-700 bg-purple-950/20 rounded-2xl p-5 mb-8">
        <p className="text-sm text-purple-300">Último disco catalogado</p>

        <h2 className="text-2xl font-bold mt-2">
          #{lastAlbum.catalog} {lastAlbum.artist}
        </h2>

        <p className="text-[#c7bda8]">{lastAlbum.album}</p>

        <Link
          href={`/album/${lastAlbum.catalog}`}
          className="inline-block mt-4 text-purple-300"
        >
          Abrir disco →
        </Link>
      </section>

      <nav className="grid grid-cols-2 gap-3 mb-8">
        <Menu href="/" title="📀 Coleção" />
        <Menu href="/tracks" title="🎵 Faixas" />
        <Menu href="/narrative" title="🧠 Narrativa" />
        <Menu href="/analytics" title="📊 BI do Colecionador" />
        <Menu href="/sessions" title="🎧 Sessões" />
      </nav>

      <input
        className="w-full mb-6 rounded-xl border border-[#3a3a3a] bg-[#141414] p-4 text-[#f5ead2] outline-none focus:border-purple-500"
        placeholder="Pesquisar disco, artista, gênero ou papel..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Coleção ({filteredAlbums.length})
        </h2>

        {filteredAlbums.map((album) => (
          <Link
            key={album.catalog}
            href={`/album/${album.catalog}`}
            className="block border border-[#2a2a2a] rounded-2xl p-5 bg-[#111] hover:border-purple-500 transition"
          >
            <p className="text-sm text-purple-400">#{album.catalog}</p>
            <h3 className="text-2xl font-bold">{album.artist}</h3>
            <p className="text-[#c7bda8]">{album.album}</p>

            <div className="flex flex-wrap gap-2 mt-4 text-sm">
              <Tag>{album.year}</Tag>
              <Tag>{album.genre}</Tag>
              <Tag>{album.role}</Tag>
              <Tag>{album.tracks} faixas</Tag>
            </div>
          </Link>
        ))}
      </section>
      <BottomNav />
    </main>
  );
}

function Stat({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`border ${color} rounded-2xl p-4 bg-[#111]`}>
      <p className="text-sm text-[#aaa]">{title}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

function Menu({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="border border-[#333] rounded-xl p-4 text-center bg-[#111] hover:border-purple-500"
    >
      {title}
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[#333] rounded-full px-3 py-1 text-[#c7bda8]">
      {children}
    </span>
  );
}