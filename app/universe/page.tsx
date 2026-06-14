import Link from "next/link";
import { albums } from "../data/albums";
import BottomNav from "../components/BottomNav";

const nodes = [
  { label: "Reggae", catalogs: ["002", "004", "005", "006", "007"] },
  { label: "Hip-Hop", catalogs: ["008", "009", "010", "011", "012"] },
  { label: "Jazz Bridge", catalogs: ["011", "013", "014"] },
  { label: "Jazz", catalogs: ["014", "015", "016", "017", "018"] },
  { label: "Brasil", catalogs: ["001", "019"] },
];

export default function UniversePage() {
  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          UNIVERSO DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O universo Terdam Dog.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          A coleção vista como constelações musicais conectadas por narrativa.
        </p>
      </section>

      <section className="rounded-[2rem] border border-purple-800 bg-purple-950/20 p-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <UniverseNode title="Reggae" value="Jamaica" />
          <UniverseNode title="Hip-Hop" value="NYC / Golden Age" />
          <UniverseNode title="Jazz" value="Fonte e linguagem" />
          <UniverseNode title="Brasil" value="Origem e retorno" />
        </div>
      </section>

      <section className="space-y-6">
        {nodes.map((node, index) => {
          const nodeAlbums = node.catalogs
            .map((catalog) => albums.find((album) => album.catalog === catalog))
            .filter(Boolean);

          return (
            <div key={node.label}>
              <section className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-5">
                <p className="text-sm tracking-[0.3em] text-purple-400">
                  CONSTELAÇÃO
                </p>

                <h2 className="text-3xl font-black mt-3">
                  {node.label}
                </h2>

                <div className="mt-5 space-y-3">
                  {nodeAlbums.map((album: any) => (
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

              {index < nodes.length - 1 && (
                <div className="flex justify-center my-4">
                  <span className="rounded-full border border-purple-700 px-4 py-2 text-purple-400">
                    ↓ conexão
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <BottomNav />
    </main>
  );
}

function UniverseNode({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-[#2b241c] bg-brand-black p-4">
      <p className="text-2xl font-black">{title}</p>
      <p className="text-sm text-[#b8aa91] mt-2">{value}</p>
    </div>
  );
}