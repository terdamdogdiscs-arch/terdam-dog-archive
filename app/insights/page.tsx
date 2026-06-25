import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "../components/BottomNav";
import { genreColor } from "../lib/genreColor";
import { formatTotalDuration } from "../lib/discogs";
import { getTotalValue } from "../lib/stats";
import { countPrimaryGenres, getPrimaryGenre } from "../lib/genreGroup";
import { albums } from "../data/albums";
import { connections } from "../data/connections";
import { DnaRadar, ConnectedBars, YearArea } from "../components/InsightsCharts";
import {
  collectionSeed,
  collectionStats,
  collectionScore,
} from "../data/seed";

export const metadata: Metadata = {
  title: "Análises — TerdamDog Archive",
  description:
    "Uma leitura automática da coleção: gêneros, países, décadas, valor estimado e narrativa.",
};

const GENRE_GROUPS: { label: string; filter: (album: (typeof collectionSeed)[number]) => boolean }[] = [
  { label: "Reggae", filter: (album) => getPrimaryGenre(album) === "Reggae" },
  { label: "Hip-Hop", filter: (album) => getPrimaryGenre(album) === "Hip-Hop" },
  { label: "Jazz", filter: (album) => getPrimaryGenre(album) === "Jazz" },
  { label: "MPB/Samba", filter: (album) => getPrimaryGenre(album) === "MPB/Samba" },
];

function countBy<T extends Record<string, unknown>>(items: T[], field: keyof T) {
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

export default async function InsightsPage() {
  const cookieStore = await cookies();
  const vaultUnlocked = cookieStore.get("vault_access")?.value === "granted";

  const byGenre = countPrimaryGenres(collectionSeed);
  const byCountry = countBy(collectionSeed, "country");
  const byRole = countBy(collectionSeed, "role");

  const byDecade = collectionSeed.reduce<Record<string, number>>((acc, album) => {
    const decade = getDecade(album.year);
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const referenceCount = collectionSeed.filter((a) => a.role === "Referência").length;

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
    getTotalValue(albums) / collectionStats.totalAlbums
  );

  function resolvedDurationSeconds(album: (typeof collectionSeed)[number]): number {
    if (album.totalDurationSeconds) return album.totalDurationSeconds;
    if (album.totalDurationOverride) {
      const parts = album.totalDurationOverride.split(":").map(Number);
      if (parts.length === 2) return parts[0] * 60 + parts[1];
    }
    return 0;
  }

  const albumsWithDuration = collectionSeed.filter(
    (album) => resolvedDurationSeconds(album) > 0
  );

  const totalDurationSeconds = albumsWithDuration.reduce(
    (sum, album) => sum + resolvedDurationSeconds(album),
    0
  );

  const avgDurationSeconds = albumsWithDuration.length
    ? Math.round(totalDurationSeconds / albumsWithDuration.length)
    : 0;

  const longestAlbum = albumsWithDuration.length
    ? [...albumsWithDuration].sort(
        (a, b) => resolvedDurationSeconds(b) - resolvedDurationSeconds(a)
      )[0]
    : undefined;

  const shortestAlbum = albumsWithDuration.length
    ? [...albumsWithDuration].sort(
        (a, b) => resolvedDurationSeconds(a) - resolvedDurationSeconds(b)
      )[0]
    : undefined;

  const durationByGenre = GENRE_GROUPS.map((group) => {
    const items = collectionSeed.filter(group.filter);
    const seconds = items.reduce(
      (sum, album) => sum + resolvedDurationSeconds(album),
      0
    );

    return { ...group, seconds, count: items.length };
  });

  const movieCount = Math.round(totalDurationSeconds / (2 * 3600));
  const totalDays = totalDurationSeconds / (24 * 3600);

  // 1) DNA sonoro agregado (média dos 4 eixos por toda a coleção)
  const dnaTotals = collectionSeed.reduce(
    (acc, album) => {
      acc.reggae += album.dna.reggae;
      acc.hiphop += album.dna.hiphop;
      acc.jazz += album.dna.jazz;
      acc.brasil += album.dna.brasil;
      return acc;
    },
    { reggae: 0, hiphop: 0, jazz: 0, brasil: 0 }
  );
  const n = collectionSeed.length || 1;
  const dnaData = [
    { subject: "Reggae", value: Math.round(dnaTotals.reggae / n) },
    { subject: "Hip-Hop", value: Math.round(dnaTotals.hiphop / n) },
    { subject: "Jazz", value: Math.round(dnaTotals.jazz / n) },
    { subject: "Brasil", value: Math.round(dnaTotals.brasil / n) },
  ];

  // 2) Conexões como rede — contagem por disco (source ou target)
  const connCount: Record<string, number> = {};
  for (const c of connections) {
    if (c.source) connCount[c.source] = (connCount[c.source] || 0) + 1;
    if (c.target) connCount[c.target] = (connCount[c.target] || 0) + 1;
  }
  const totalConnections = connections.length;
  const topConnected = Object.entries(connCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([catalog, count]) => {
      const album = collectionSeed.find((a) => a.catalog === catalog);
      return {
        catalog,
        count,
        label: `TD-${catalog} · ${album?.artist ?? ""}`,
        cover: album?.cover ?? "",
        artist: album?.artist ?? "",
        album: album?.album ?? "",
      };
    });
  const mostConnected = topConnected[0];

  // 3) Série temporal por ano (faixas de 5 anos, com lacunas preenchidas)
  const yearBuckets: Record<number, number> = {};
  collectionSeed.forEach((album) => {
    if (!album.year) return;
    const bucket = Math.floor(album.year / 5) * 5;
    yearBuckets[bucket] = (yearBuckets[bucket] || 0) + 1;
  });
  const bucketKeys = Object.keys(yearBuckets).map(Number);
  const minBucket = Math.min(...bucketKeys);
  const maxBucket = Math.max(...bucketKeys);
  const yearData: { period: string; count: number }[] = [];
  for (let y = minBucket; y <= maxBucket; y += 5) {
    yearData.push({ period: `${y}–${y + 4}`, count: yearBuckets[y] || 0 });
  }

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
          Uma leitura automática da coleção: gêneros, países, décadas,
          valor estimado e narrativa.
        </p>
      </section>

      <section className="premium-card rounded-[2rem] border border-purple-800 bg-purple-950/20 p-6 mb-8">
        <p className="text-sm text-purple-300">Pontuação da Coleção</p>

        <p className="text-6xl font-black text-brand-purple mt-2">
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

        {vaultUnlocked ? (
          <>
            <Card title="Valor estimado" value={`R$ ${getTotalValue(albums)}`} />
            <Card title="Média por disco" value={`R$ ${avgValue}`} />
            <Card title="Mais valioso" value={`TD-${mostValuable.catalog}`} detail={mostValuable.artist} />
            <Card title="Ganho potencial" value={`R$ ${totalPotentialGain}`} />
          </>
        ) : (
          <div className="col-span-2 premium-card rounded-3xl border border-[#2b241c] bg-[#11100e] p-5">
            <p className="text-sm text-[#9d9079]">Valor da coleção</p>
            <p className="text-2xl font-black mt-2 select-none blur-sm text-[#9d9079]">
              R$ ••••••
            </p>
            <Link
              href="/vault/login?from=/insights"
              className="mt-3 inline-block text-sm text-purple-400"
            >
              🔒 Desbloquear valor →
            </Link>
          </div>
        )}

        <Card
          title="Discos de Referência"
          value={referenceCount}
          detail="Ancoragens atemporais da coleção"
        />
      </section>

      <Section
        title="Gêneros principais"
        description="Macrogrupos exclusivos. Os subgêneros continuam preservados na ficha de cada disco."
        data={byGenre}
        accentFor={genreColor}
      />
      <Section title="Distribuição por país" data={byCountry} />
      <Section title="Distribuição por década" data={byDecade} />
      <Section title="Papéis narrativos" data={byRole} />

      <section className="mt-10">
        <h2 className="text-3xl font-black mb-2">DNA da Coleção</h2>
        <p className="text-sm text-[#9d9079] mb-4">
          A personalidade sonora dos {collectionStats.totalAlbums} discos,
          condensada em quatro eixos.
        </p>

        <div className="premium-card rounded-[2rem] border border-[#2b241c] bg-[#111111] p-4">
          <DnaRadar data={dnaData} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-black mb-2">Centro da Rede</h2>
        <p className="text-sm text-[#9d9079] mb-4">
          {totalConnections} conexões narrativas ligam a coleção.{" "}
          {mostConnected &&
            `O disco mais conectado é TD-${mostConnected.catalog}.`}
        </p>

        {mostConnected && (
          <div className="premium-card mb-4 flex items-center gap-4 rounded-3xl border border-purple-800 bg-purple-950/20 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2b241c] bg-brand-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mostConnected.cover}
                alt={mostConnected.album}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-purple-400">TD-{mostConnected.catalog}</p>
              <p className="font-black leading-tight">{mostConnected.artist}</p>
              <p className="text-sm text-[#b8aa91] truncate">
                {mostConnected.album}
              </p>
              <p className="text-xs text-brand-yellow mt-1">
                {mostConnected.count} conexões
              </p>
            </div>
          </div>
        )}

        <div className="premium-card rounded-[2rem] border border-[#2b241c] bg-[#111111] p-4">
          <ConnectedBars data={topConnected} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-black mb-2">Quando a Coleção Foi Feita</h2>
        <p className="text-sm text-[#9d9079] mb-4">
          Distribuição dos discos por ano de lançamento, em faixas de 5 anos —
          clusters e lacunas da coleção.
        </p>

        <div className="premium-card rounded-[2rem] border border-[#2b241c] bg-[#111111] p-4">
          <YearArea data={yearData} />
        </div>
      </section>

      {totalDurationSeconds > 0 && (
        <section className="mt-8">
          <h2 className="text-3xl font-black mb-4">⏱ Tempo de escuta</h2>

          {albumsWithDuration.length < collectionStats.totalAlbums && (
            <p className="text-xs text-[#9d9079] mb-4 border border-[#2b241c] rounded-2xl px-4 py-2">
              ⚠ {collectionStats.totalAlbums - albumsWithDuration.length}{" "}
              {collectionStats.totalAlbums - albumsWithDuration.length === 1 ? "disco sem" : "discos sem"} dados de duração ainda não incluído{collectionStats.totalAlbums - albumsWithDuration.length === 1 ? "" : "s"} no total.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card
              title="Tempo total da coleção"
              value={formatTotalDuration(totalDurationSeconds)}
              detail={`${albumsWithDuration.length} de ${collectionStats.totalAlbums} discos com dados de duração`}
            />

            <Card
              title="Média por disco"
              value={formatTotalDuration(avgDurationSeconds)}
            />

            {longestAlbum && (
              <Card
                title="Disco mais longo"
                value={formatTotalDuration(longestAlbum.totalDurationSeconds || 0)}
                detail={`${longestAlbum.artist} — ${longestAlbum.album}`}
              />
            )}

            {shortestAlbum && (
              <Card
                title="Disco mais curto"
                value={formatTotalDuration(shortestAlbum.totalDurationSeconds || 0)}
                detail={`${shortestAlbum.artist} — ${shortestAlbum.album}`}
              />
            )}
          </div>

          <div className="space-y-4">
            {durationByGenre
              .filter((group) => group.count > 0)
              .map((group) => (
                <div key={group.label}>
                  <div className="flex justify-between mb-1">
                    <span>{group.label}</span>

                    <span className="font-black text-brand-yellow">
                      {group.seconds > 0
                        ? `${formatTotalDuration(group.seconds)} (${group.count} ${group.count === 1 ? "disco" : "discos"})`
                        : `${group.count} ${group.count === 1 ? "disco" : "discos"}`}
                    </span>
                  </div>

                  <div className="h-2 bg-[#11100e] rounded">
                    <div
                      className="h-2 bg-brand-yellow rounded"
                      style={{
                        width: `${totalDurationSeconds ? (group.seconds / totalDurationSeconds) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {totalDurationSeconds > 0 && (
        <section className="premium-card mt-8 rounded-[2rem] border border-yellow-700 bg-yellow-950/10 p-6">
          <p className="text-sm tracking-[0.3em] text-yellow-400">
            MARATONA DE ESCUTA
          </p>

          <p className="text-4xl font-black mt-3 leading-tight">
            Para ouvir toda a coleção você precisaria de{" "}
            <span className="text-brand-yellow">
              {formatTotalDuration(totalDurationSeconds)}
            </span>
            .
          </p>

          <p className="text-[#b8aa91] mt-4">
            {movieCount > 0
              ? `Isso equivale a cerca de ${movieCount} ${movieCount === 1 ? "filme" : "filmes"} de 2 horas, ou`
              : "Isso equivale a"}{" "}
            {totalDays >= 1
              ? `${totalDays.toFixed(1)} dias de música contínua, sem parar para dormir.`
              : "menos de um dia de música contínua — dá para tocar do café da manhã até o fim da noite."}
          </p>

          <p className="text-xs text-[#9d9079] mt-4">
            * baseado nos {albumsWithDuration.length} discos da coleção com duração disponível no Discogs.
          </p>
        </section>
      )}

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
              A coleção pelo tempo, disco a disco
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
    <div className="premium-card rounded-3xl border border-[#2b241c] bg-[#11100e] p-4">
      <p className="text-sm text-[#9d9079]">{title}</p>
      <p className="text-2xl font-black mt-2">{value}</p>
      {detail && <p className="text-sm text-[#b8aa91] mt-1">{detail}</p>}
    </div>
  );
}

function Section({
  title,
  description,
  data,
  accentFor,
}: {
  title: string;
  description?: string;
  data: Record<string, number>;
  accentFor?: (key: string) => { bg: string; text: string };
}) {
  const max = Math.max(...Object.values(data));

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-black mb-4">{title}</h2>
      {description && (
        <p className="-mt-2 mb-5 text-sm text-[#9d9079]">{description}</p>
      )}

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
