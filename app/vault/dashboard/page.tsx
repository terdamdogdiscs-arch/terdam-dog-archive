import Link from "next/link";
import { collectionStats, collectionScore } from "../../data/seed";
import VaultGate from "../../components/VaultGate";

export default function DashboardPage() {

  const countries = collectionStats.countries.length;
  const genres = collectionStats.genres.length;
  const decades = collectionStats.decades.length;
  const totalValue = collectionStats.totalEstimatedValue;
  const score = collectionScore;

  return (
    <VaultGate redirectTo="/vault/dashboard">
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-6">

      <Link
        href="/vault"
        className="text-purple-400"
      >
        ← Cofre
      </Link>

      <section className="mt-8">

        <p className="text-sm tracking-[0.35em] text-purple-400">
          PAINEL DO COLECIONADOR
        </p>

        <h1 className="text-5xl font-black mt-4">
          Inteligência
        </h1>

      </section>

      <section className="grid grid-cols-2 gap-4 mt-8">

        <Metric
          title="Patrimônio"
          value={`R$ ${totalValue}`}
        />

        <Metric
          title="Discos"
          value={collectionStats.totalAlbums}
        />

        <Metric
          title="Países"
          value={countries}
        />

        <Metric
          title="Gêneros"
          value={genres}
        />

        <Metric
          title="Décadas"
          value={decades}
        />

        <Metric
          title="Diversidade"
          value={`${score}/100`}
        />

      </section>

      <section className="mt-10 rounded-3xl border border-purple-800 bg-purple-950/20 p-6">

        <h2 className="text-2xl font-black">
          DNA do Colecionador
        </h2>

        <p className="text-[#b8aa91] mt-3">
          A coleção atualmente cobre
          {` ${countries} países, `}
          {genres} gêneros e
          {` ${decades} décadas.`}
        </p>

      </section>

    </main>
    </VaultGate>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-5">

      <p className="text-sm text-[#9d9079]">
        {title}
      </p>

      <p className="text-3xl font-black mt-2">
        {value}
      </p>

    </div>
  );
}