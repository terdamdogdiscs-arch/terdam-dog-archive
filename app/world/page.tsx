import Link from "next/link";
import { albums } from "../data/albums";
import BottomNav from "../components/BottomNav";

export default function WorldPage() {
  const countries = [...new Set(albums.map((album) => album.country))];

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          ORIGENS DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O mapa da escuta.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Países, cenas e origens musicais que formam a fundação Terdam Dog.
        </p>
      </section>

      <section className="grid gap-4">
        {countries.map((country) => {
          const countryAlbums = albums.filter(
            (album) => album.country === country
          );

          return (
            <section
              key={country}
              className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-5"
            >
              <h2 className="text-3xl font-black">{country}</h2>

              <p className="text-[#9d9079] mt-1">
                {countryAlbums.length} disco(s)
              </p>

              <div className="mt-4 space-y-3">
                {countryAlbums.map((album) => (
                  <Link
                    key={album.catalog}
                    href={`/album/${album.catalog}`}
                    className="block rounded-2xl border border-[#2b241c] p-4 hover:border-purple-500"
                  >
                    <p className="text-purple-400">TD-{album.catalog}</p>
                    <p className="font-black">{album.artist}</p>
                    <p className="text-sm text-[#b8aa91]">{album.album}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <BottomNav />
    </main>
  );
}