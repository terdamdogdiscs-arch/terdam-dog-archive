import Link from "next/link";
import { albums } from "../data/albums";
import { discoveries } from "../data/discover";
import BottomNav from "../components/BottomNav";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Collection
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          DISCOVERY ENGINE
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O que falta na coleção.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Sugestões baseadas nos caminhos que a fundação 001–019 já abriu.
        </p>
      </section>

      <section className="space-y-6">
        {discoveries.map((block) => {
          const baseAlbums = block.basedOn
            .map((catalog) => albums.find((album) => album.catalog === catalog))
            .filter(Boolean);

          return (
            <article
              key={block.id}
              className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-5"
            >
              <p className="text-xs tracking-[0.3em] text-purple-400">
                DISCOVERY PATH
              </p>

              <h2 className="text-3xl font-black mt-3">{block.title}</h2>

              <p className="text-[#b8aa91] mt-4 leading-relaxed">
                {block.reason}
              </p>

              <div className="mt-5">
                <p className="text-sm text-[#9d9079] mb-2">
                  Baseado no que você já tem:
                </p>

                <div className="flex flex-wrap gap-2">
                  {baseAlbums.map((album: any) => (
                    <Link
                      key={album.catalog}
                      href={`/album/${album.catalog}`}
                      className="rounded-full border border-purple-700 px-3 py-1 text-sm text-purple-300"
                    >
                      TD-{album.catalog}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-[#9d9079] mb-3">
                  Talvez falte:
                </p>

                <div className="space-y-3">
                  {block.suggestions.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#2b241c] bg-brand-black p-4"
                    >
                      <p className="font-black">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <BottomNav />
    </main>
  );
}