import BottomNav from "../components/BottomNav";
import Link from "next/link";
import { albums } from "../data/albums";
import { tracks } from "../data/tracks";
import { collectionScore } from "../data/seed";

function countBy<T extends Record<string, any>>(items: T[], field: keyof T) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = String(item[field] || "Não informado");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function decadeFromYear(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

export default function AnalyticsPage() {
  const totalAlbums = albums.length;
  const totalTracks = tracks.length;

  const byGenre = countBy(albums, "genre");
  const byCountry = countBy(albums, "country");
  const byRole = countBy(albums, "role");

  const byDecade = albums.reduce<Record<string, number>>((acc, album) => {
    const decade = decadeFromYear(album.year);
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const bpmTracks = tracks.filter((track) => track.bpm !== null);
  const tracksWithDuration = tracks.filter(
    (track) => track.duration && track.duration !== ""
  );

  const averageBpm =
    bpmTracks.length > 0
      ? Math.round(
          bpmTracks.reduce((sum, track) => sum + Number(track.bpm), 0) /
            bpmTracks.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-brand-black text-white p-6 pb-24">
      <Link href="/" className="text-purple-400">
        ← Voltar
      </Link>

      <h1 className="text-4xl font-bold mt-8 mb-2">
        📊 Collector BI
      </h1>

      <p className="text-gray-500 mb-8">
        Inteligência da coleção Terdam Dog
      </p>

      <section className="border border-purple-700 rounded p-6 mb-8 bg-purple-950/20">
        <p className="text-gray-400 text-sm">
          Collection Score
        </p>

        <p className="text-6xl font-bold mt-2">
          {collectionScore}
        </p>

        <p className="text-gray-500 mt-2">
          Mede diversidade de gêneros, países e décadas usando o seed central.
        </p>

        <div className="h-3 bg-gray-900 rounded mt-4">
          <div
            className="h-3 bg-purple-500 rounded"
            style={{ width: `${collectionScore}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Discos" value={totalAlbums} />
        <Card title="Faixas" value={totalTracks} />
        <Card title="BPM médio" value={averageBpm || "-"} />
        <Card title="Duração catalogada" value={tracksWithDuration.length} />
      </div>

      <Section title="Discos por gênero" data={byGenre} />
      <Section title="Discos por país" data={byCountry} />
      <Section title="Discos por década" data={byDecade} />
      <Section title="Papel narrativo" data={byRole} />

      <section className="mt-10 border border-gray-800 rounded p-4">
        <h2 className="text-2xl font-bold mb-4">
          Data Health
        </h2>

        <Health
          label="Faixas com duração"
          value={tracksWithDuration.length}
          total={totalTracks}
        />

        <Health
          label="Faixas com BPM"
          value={bpmTracks.length}
          total={totalTracks}
        />
      </section>
      <BottomNav />
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
    <div className="border border-gray-800 rounded p-4">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const max = Math.max(...Object.values(data));

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          const width = `${(value / max) * 100}%`;

          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span>{key}</span>

                <span className="text-purple-400 font-bold">
                  {value}
                </span>
              </div>

              <div className="h-2 bg-gray-900 rounded">
                <div
                  className="h-2 bg-purple-500 rounded"
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

function Health({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent = Math.round((value / total) * 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>{label}</span>

        <span className="text-purple-400">
          {percent}%
        </span>
      </div>

      <div className="h-2 bg-gray-900 rounded">
        <div
          className="h-2 bg-green-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}