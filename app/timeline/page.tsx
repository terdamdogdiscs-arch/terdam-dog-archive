import Link from "next/link";
import { albums } from "../data/albums";
import BottomNav from "../components/BottomNav";

export default function TimelinePage() {
  const sortedAlbums = [...albums].sort((a, b) => a.year - b.year);

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          LINHA DO TEMPO DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          A coleção pelo tempo.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Uma leitura histórica dos discos da coleção.
        </p>
      </section>

      <section className="space-y-5">
        {sortedAlbums.map((album) => (
          <Link
            key={album.catalog}
            href={`/album/${album.catalog}`}
            className="block border-l-4 border-purple-600 pl-5 py-3 hover:border-yellow-500"
          >
            <p className="text-purple-400 text-xl font-black">{album.year}</p>
            <h2 className="text-2xl font-black mt-1">{album.artist}</h2>
            <p className="text-[#b8aa91]">{album.album}</p>
            <p className="text-sm text-[#9d9079] mt-1">
              TD-{album.catalog} • {album.genre} • {album.role}
            </p>
          </Link>
        ))}
      </section>

      <BottomNav />
    </main>
  );
}