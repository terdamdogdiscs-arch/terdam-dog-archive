import Link from "next/link";
import { albums } from "../data/albums";

export default function VaultPage() {
  const totalValue = albums.reduce(
    (sum, album) => sum + (album.estimatedValue || 0),
    0
  );

  const averageValue = Math.round(totalValue / albums.length);

  const topAlbums = [...albums]
    .sort(
      (a, b) =>
        (b.estimatedValue || 0) -
        (a.estimatedValue || 0)
    )
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-6">

      <Link
        href="/"
        className="text-purple-400"
      >
        ← Collection
      </Link>

      <section className="mt-8">

        <p className="text-sm tracking-[0.35em] text-purple-400">
          PRIVATE VAULT
        </p>

        <h1 className="text-5xl font-black mt-4">
          Collection Value
        </h1>

      </section>

      <section className="grid grid-cols-2 gap-4 mt-8">

        <Card
          title="Valor Total"
          value={`R$ ${totalValue}`}
        />

        <Card
          title="Valor Médio"
          value={`R$ ${averageValue}`}
        />

        <Card
          title="Discos"
          value={albums.length}
        />

        <Card
          title="Top Item"
          value={`TD-${topAlbums[0]?.catalog}`}
        />

      </section>

      <section className="mt-10">

        <h2 className="text-3xl font-black mb-4">
          Top 10 Valor
        </h2>

        <div className="space-y-3">

          {topAlbums.map((album) => (
            <div
              key={album.catalog}
              className="rounded-2xl border border-[#2b241c] p-4 flex justify-between"
            >

              <div>
                <p className="text-purple-400">
                  TD-{album.catalog}
                </p>

                <p className="font-black">
                  {album.artist}
                </p>

                <p className="text-sm text-[#9d9079]">
                  {album.album}
                </p>
              </div>

              <p className="text-xl font-black">
                R$ {album.estimatedValue}
              </p>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4">
      <p className="text-sm text-[#9d9079]">
        {title}
      </p>

      <p className="text-2xl font-black mt-2">
        {value}
      </p>
    </div>
  );
}