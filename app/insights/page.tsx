import Link from "next/link";
import BottomNav from "../components/BottomNav";
import { genreColor } from "../lib/genreColor";
import {
  collectionSeed,
  collectionStats,
  collectionScore,
} from "../data/seed";

function countBy<T extends Record<string, any>>(items: T[], field: keyof T) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = String(item[field] || "Não informado");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function getTop(data: Record<string, number>) {
  return Object.entries(data).sort((a, b) => b[1] - a[1])[0];
}

function getDecade(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

export default function InsightsPage() {
  const byGenre = countBy(collectionSeed, "genre");
  const byCountry = countBy(collectionSeed, "country");
  const byRole = countBy(collectionSeed, "role");

  const byDecade = collectionSeed.reduce<Record<string, number>>((acc, album) => {
    const decade = getDecade(album.year);
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const [topGenre, topGenreCount] = getTop(byGenre);
  const [topCountry, topCountryCount] = getTop(byCountry);
  const [topRole, topRoleCount] = getTop(byRole);
  const [topDecade, topDecadeCount] = getTop(byDecade);

  const oldestAlbum = [...collectionSeed].sort((a, b) => a.year - b.year)[0];
  const newestAlbum = [...collectionSeed].sort((a, b) => b.year - a.year)[0];

  const mostValuable = [...collectionSeed].sort(
    (a, b) => b.financial.estimatedValue - a.financial.estimatedValue
  )[0];

  const totalPotentialGain = collectionSeed.reduce((sum, album) => {
    return sum + (album.financial.potentialGain || 0);
  }, 0);

  const avgValue = Math.round(
    collectionStats.totalEstimatedValue / collectionStats.totalAlbums
  );

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          LEITURA DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O DNA da coleção.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Uma leitura automática da fundação 001–019: gêneros, países, décadas,
          valor estimado e narrativa.
        </p>
      </section>

      <section className="rounded-[2rem] border border-purple-800 bg-purple-950/20 p-6 mb-8">
        <p className="text-sm text-purple-300">Pontuação da Coleção</p>

        <p className="text-6xl font-black mt-2">
          {collectionScore}
          <span className="text-2xl text-[#9d9079]">/100</span>
        </p>

        <p className="text-[#b8aa91] mt-3">
          Mede diversidade de gêneros, países e décadas usando o seed central.
        </p>

        <div className="h-3 bg-[#11100e] rounded mt-5">
          <div
            className="h-3 bg-purple-500 rounded"
            style={{ width: `${collectionScore}%` }}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-8">
        <Card title="Gênero dominante" value={`${topGenre} (${topGenreCount})`} />
        <Card title="País dominante" value={`${topCountry} (${topCountryCount})`} />
        <Card title="Década dominante" value={`${topDecade} (${topDecadeCount})`} />
        <Card title="Papel dominante" value={`${topRole} (${topRoleCount})`} />
        <Card title="Mais antigo" value={`${oldestAlbum.year}`} detail={oldestAlbum.artist} />
        <Card title="Mais novo" value={`${newestAlbum.year}`} detail={newestAlbum.artist} />
        <Card title="Valor estimado" value={`R$ ${collectionStats.totalEstimatedValue}`} />
        <Card title="Média por disco" value={`R$ ${avgValue}`} />
        <Card title="Mais valioso" value={`TD-${mostValuable.catalog}`} detail={mostValuable.artist} />
        <Card title="Ganho potencial" value={`R$ ${totalPotentialGain}`} />
      </section>

      <Section title="Distribuição por gênero" data={byGenre} accentFor={genreColor} />
      <Section title="Distribuição por país" data={byCountry} />
      <Section title="Distribuição por década" data={byDecade} />
      <Section title="Papéis narrativos" data={byRole} />

      <section className="mt-8">
        <h2 className="text-3xl font-black mb-4">Visualizações</h2>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/heatmap"
            className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 hover:border-purple-500"
          >
            <p className="font-black">Mapa de Calor</p>
            <p className="text-sm text-[#9d9079] mt-1">
              Onde a coleção pulsa por gênero, país e papel
            </p>
          </Link>

          <Link
            href="/timeline"
            className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 hover:border-purple-500"
          >
            <p className="font-black">Linha do Tempo</p>
            <p className="text-sm text-[#9d9079] mt-1">
              A coleção pelo tempo, da fundação 001–019
            </p>
          </Link>

          <Link
            href="/universe"
            className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 hover:border-purple-500"
          >
            <p className="font-black">Universo</p>
            <p className="text-sm text-[#9d9079] mt-1">
              Constelações musicais conectadas por narrativa
            </p>
          </Link>

          <Link
            href="/world"
            className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 hover:border-purple-500"
          >
            <p className="font-black">Mundo</p>
            <p className="text-sm text-[#9d9079] mt-1">
              Países e cenas que formam a fundação
            </p>
          </Link>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

function Card({
  title,
  value,
  detail,
}: {
  title: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4">
      <p className="text-sm text-[#9d9079]">{title}</p>
      <p className="text-2xl font-black mt-2">{value}</p>
      {detail && <p className="text-sm text-[#b8aa91] mt-1">{detail}</p>}
    </div>
  );
}

function Section({
  title,
  data,
  accentFor,
}: {
  title: string;
  data: Record<string, number>;
  accentFor?: (key: string) => { bg: string; text: string };
}) {
  const max = Math.max(...Object.values(data));

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-black mb-4">{title}</h2>

      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          const width = `${(value / max) * 100}%`;
          const accent = accentFor?.(key) ?? {
            bg: "bg-purple-500",
            text: "text-purple-400",
          };

          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span>{key}</span>
                <span className={`${accent.text} font-black`}>{value}</span>
              </div>

              <div className="h-2 bg-[#11100e] rounded">
                <div
                  className={`h-2 ${accent.bg} rounded`}
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}