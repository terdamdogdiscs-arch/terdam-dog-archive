import Link from "next/link";
import { albums, type Album } from "../data/albums";
import { discoveries } from "../data/discover";
import { connections } from "../data/connections";
import BottomNav from "../components/BottomNav";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          MOTOR DE DESCOBERTA
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O que falta na coleção.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Sugestões baseadas nos caminhos que a coleção já abriu.
        </p>
      </section>

      <section className="space-y-6">
        {discoveries.map((block) => {
          const baseAlbums = block.basedOn
            .map((catalog) => albums.find((album) => album.catalog === catalog))
            .filter((album): album is Album => Boolean(album));

          return (
            <article
              key={block.id}
              className="premium-card rounded-3xl border border-[#2b241c] bg-[#11100e] p-5"
            >
              <p className="text-xs tracking-[0.3em] text-purple-400">
                CAMINHO DE DESCOBERTA
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
                  {baseAlbums.map((album) => {
                    const link = connections.find(
                      (item) =>
                        item.source === album.catalog ||
                        item.target === album.catalog
                    );

                    return (
                      <Link
                        key={album.catalog}
                        href={`/album/${album.catalog}`}
                        className="rounded-2xl border-[1.5px] border-purple-700 px-3 py-2 text-sm text-purple-300 hover:border-brand-yellow transition"
                      >
                        <span className="block tracking-wider">
                          TD-{album.catalog}
                        </span>

                        {link && (
                          <span className="block mt-1 text-[10px] tracking-[0.2em] text-brand-yellow">
                            ↳ {link.reason}
                          </span>
                        )}
                      </Link>
                    );
                  })}
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