import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import BottomNav from "../components/BottomNav";
import {
  ConnectionOrbit,
  DecadeColumns,
  GenreDonut,
  OriginBars,
} from "../components/InsightsCharts";
import { albums } from "../data/albums";
import { connections } from "../data/connections";
import { collectionSeed } from "../data/seed";
import { formatTotalDuration } from "../lib/discogs";
import {
  countPrimaryGenres,
  getPrimaryGenre,
  primaryGenreLabels,
} from "../lib/genreGroup";
import { getTotalValue } from "../lib/stats";

export const metadata: Metadata = {
  title: "Dados — TerdamDog Archive",
  description:
    "Uma leitura editorial da coleção por gêneros, décadas, territórios, conexões e tempo de escuta.",
};

const GENRE_COLORS: Record<string, string> = {
  Reggae: "#45a65a",
  "Hip-Hop": "#a347b6",
  Jazz: "#f5c400",
  "MPB/Samba": "#dc3d46",
  Outros: "#9d9079",
};

function resolvedDurationSeconds(
  album: (typeof collectionSeed)[number]
): number {
  if (album.totalDurationSeconds) return album.totalDurationSeconds;

  if (album.totalDurationOverride) {
    const parts = album.totalDurationOverride.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
  }

  return 0;
}

function normalizedOrigins(country: string) {
  return country
    .split("/")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default async function InsightsPage() {
  const cookieStore = await cookies();
  const vaultUnlocked = cookieStore.get("vault_access")?.value === "granted";

  const genreCounts = countPrimaryGenres(collectionSeed);
  const genreData = primaryGenreLabels
    .map((name) => ({ name, value: genreCounts[name] || 0 }))
    .filter((item) => item.value > 0);

  const decades = collectionSeed.reduce<Record<number, number>>((acc, album) => {
    const decade = Math.floor(album.year / 10) * 10;
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const decadeData = Object.entries(decades)
    .map(([decade, count]) => ({
      year: Number(decade),
      decade: `${decade}s`,
      count,
    }))
    .sort((a, b) => a.year - b.year);

  const originCounts = collectionSeed.reduce<Record<string, number>>(
    (acc, album) => {
      for (const origin of normalizedOrigins(album.country)) {
        acc[origin] = (acc[origin] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const originData = Object.entries(originCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const albumsWithDuration = collectionSeed.filter(
    (album) => resolvedDurationSeconds(album) > 0
  );
  const totalDurationSeconds = albumsWithDuration.reduce(
    (sum, album) => sum + resolvedDurationSeconds(album),
    0
  );

  const durationByGenre = primaryGenreLabels
    .map((name) => {
      const items = collectionSeed.filter(
        (album) => getPrimaryGenre(album) === name
      );
      return {
        name,
        seconds: items.reduce(
          (sum, album) => sum + resolvedDurationSeconds(album),
          0
        ),
        count: items.length,
      };
    })
    .filter((item) => item.count > 0);

  const connectionCounts: Record<string, number> = {};
  for (const connection of connections) {
    connectionCounts[connection.source] =
      (connectionCounts[connection.source] || 0) + 1;
    if (connection.target) {
      connectionCounts[connection.target] =
        (connectionCounts[connection.target] || 0) + 1;
    }
  }

  const networkData = Object.entries(connectionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([catalog, count]) => {
      const album = collectionSeed.find((item) => item.catalog === catalog)!;
      return {
        catalog,
        count,
        artist: album.artist,
        album: album.album,
        cover: album.cover,
      };
    });

  const oldestAlbum = [...collectionSeed].sort((a, b) => a.year - b.year)[0];
  const newestAlbum = [...collectionSeed].sort((a, b) => b.year - a.year)[0];
  const topGenre = [...genreData].sort((a, b) => b.value - a.value)[0];
  const topDecade = [...Object.entries(decades)].sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Frase editorial da década líder, gerada dinamicamente a partir de topDecade.
  const decadeGravityPhrases: Record<string, string> = {
    "1950": "Tudo nasce nos anos 50 — antes de a coleção saber que seria uma.",
    "1960": "Os anos 60 são a fundação silenciosa do arquivo.",
    "1970": "Os anos 70 são o coração quente da coleção.",
    "1980": "Os anos 80 são o centro de gravidade.",
    "1990": "Os anos 90 puxam a coleção para o seu eixo.",
    "2000": "Os anos 2000 são onde a coleção se adensa.",
    "2010": "Os anos 2010 concentram a massa do arquivo.",
    "2020": "Os anos 2020 já reivindicam o centro.",
  };
  const topDecadeKey = topDecade?.[0] ?? "";
  const topDecadeShort =
    Number(topDecadeKey) >= 2000 ? topDecadeKey : String(topDecadeKey).slice(2);
  const decadePhrase =
    decadeGravityPhrases[topDecadeKey] ??
    `Os anos ${topDecadeShort} são o centro de gravidade.`;
  const topOrigin = originData[0];
  const mostValuable = [...collectionSeed].sort(
    (a, b) => b.financial.estimatedValue - a.financial.estimatedValue
  )[0];
  const totalValue = getTotalValue(albums);
  const averageValue = Math.round(totalValue / albums.length);

  const heroCovers = ["002", "008", "013", "025"]
    .map((catalog) => collectionSeed.find((album) => album.catalog === catalog))
    .filter(Boolean) as typeof collectionSeed;

  return (
    <main className="wide-page min-h-screen bg-brand-black p-5 pb-32 text-[#f4ead8] lg:px-8">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 overflow-hidden rounded-[2.25rem] border border-[#30271f] bg-[radial-gradient(circle_at_82%_18%,rgba(123,45,139,0.28),transparent_35%),linear-gradient(135deg,#17120d,#090807_62%)] p-6 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <p className="text-xs font-bold tracking-[0.36em] text-purple-400">
            RETRATO VIVO DA COLEÇÃO
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] sm:text-6xl lg:text-7xl">
            Os dados também contam uma história.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#b8aa91]">
            Trinta e seis discos atravessam {Object.keys(decades).length} décadas, quatro grandes
            territórios sonoros e uma rede de influências que começa no Brasil,
            passa pela Jamaica, encontra Nova York e retorna transformada.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {[
              `${collectionSeed.length} discos`,
              `${Object.keys(decades).length} décadas`,
              `${connections.length} conexões`,
              formatTotalDuration(totalDurationSeconds),
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#40352a] bg-black/30 px-4 py-2 text-sm text-[#f4ead8]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-10 h-[310px] lg:mt-0 lg:h-[390px]">
          <div className="absolute inset-8 rounded-full bg-purple-600/15 blur-3xl" />
          {heroCovers.map((album, index) => {
            const positions = [
              "left-[2%] top-[18%] -rotate-6",
              "left-[29%] top-[2%] rotate-3",
              "right-[2%] top-[22%] rotate-6",
              "left-[29%] bottom-[0%] -rotate-2",
            ];
            return (
              <Link
                key={album.catalog}
                href={`/album/${album.catalog}`}
                className={`absolute aspect-square w-[42%] overflow-hidden rounded-2xl border border-white/15 bg-[#11100e] shadow-2xl transition hover:z-20 hover:scale-105 ${positions[index]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={album.cover}
                  alt={`${album.artist} — ${album.album}`}
                  className="h-full w-full object-cover"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          eyebrow="Amplitude histórica"
          value={`${oldestAlbum.year}—${newestAlbum.year}`}
          detail="do primeiro ao mais recente"
          accent="#f5c400"
        />
        <MetricCard
          eyebrow="Território dominante"
          value={topOrigin.name}
          detail={`${topOrigin.value} discos com essa origem`}
          accent="#dc3d46"
        />
        <MetricCard
          eyebrow="Pulso principal"
          value={topGenre.name}
          detail={`${topGenre.value} discos na coleção`}
          accent="#a347b6"
        />
        <MetricCard
          eyebrow="Década central"
          value={`${topDecade[0]}s`}
          detail={`${topDecade[1]} discos lançados`}
          accent="#45a65a"
        />
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="COMPOSIÇÃO"
          title="Quatro forças, uma coleção."
          description="Os gêneros não aparecem como gavetas isoladas. Eles se cruzam, emprestam linguagem uns aos outros e formam o caráter do arquivo."
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <ChartCard>
            <p className="text-xs uppercase tracking-[0.28em] text-[#9d9079]">
              Distribuição sonora
            </p>
            <GenreDonut data={genreData} total={collectionSeed.length} />
          </ChartCard>

          <ChartCard>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#9d9079]">
                  História em décadas
                </p>
                <p className="mt-2 text-2xl font-black">
                  {decadePhrase}
                </p>
              </div>
              <span className="text-4xl font-black text-brand-yellow">
                {topDecade[1]}
              </span>
            </div>
            <div className="mt-3">
              <DecadeColumns data={decadeData} />
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionHeading
            kicker="TERRITÓRIOS"
            title="A geografia da escuta."
            description="Aqui país significa origem cultural dos artistas e das obras. Discos com identidades múltiplas aparecem em mais de um território."
          />
          <ChartCard className="mt-6">
            <OriginBars data={originData} />
          </ChartCard>
        </div>

        <div>
          <SectionHeading
            kicker="CONEXÕES"
            title="Nada existe sozinho."
            description={`${connections.length} relações editoriais revelam influências, retornos e pontes escondidas entre os discos.`}
          />
          <ChartCard className="mt-6">
            {networkData[0] && (
              <ConnectionOrbit
                center={networkData[0]}
                satellites={networkData.slice(1)}
              />
            )}
          </ChartCard>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="JORNADA SONORA"
          title="Uma conversa que atravessa o Atlântico."
          description="A coleção não avança em linha reta. Ela parte, encontra outras linguagens e retorna ao ponto de origem carregando novas memórias."
        />

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            {
              number: "01",
              title: "Raiz",
              text: "Brasil e Jamaica estabelecem palavra, ritmo e consciência.",
              color: "#45a65a",
            },
            {
              number: "02",
              title: "Ponte",
              text: "Dancehall e hip-hop transformam trânsito cultural em linguagem.",
              color: "#a347b6",
            },
            {
              number: "03",
              title: "Fonte",
              text: "O jazz revela a arquitetura escondida por baixo da batida.",
              color: "#f5c400",
            },
            {
              number: "04",
              title: "Retorno",
              text: "Samba, MPB e reggae fecham o círculo sem encerrar a história.",
              color: "#dc3d46",
            },
          ].map((chapter, index) => (
            <div
              key={chapter.number}
              className="relative overflow-hidden rounded-3xl border border-[#2b241c] bg-[#11100e] p-5"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: chapter.color }}
              />
              <p className="text-sm font-black" style={{ color: chapter.color }}>
                {chapter.number}
              </p>
              <h3 className="mt-8 text-3xl font-black">{chapter.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#9d9079]">
                {chapter.text}
              </p>
              {index < 3 && (
                <span className="absolute right-4 top-5 text-[#4a4035]">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-[2.25rem] border border-yellow-700/60 bg-[linear-gradient(135deg,rgba(245,196,0,0.12),rgba(123,45,139,0.12))] p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.32em] text-brand-yellow">
              TEMPO DE ESCUTA
            </p>
            <p className="mt-3 text-6xl font-black leading-none sm:text-7xl">
              {formatTotalDuration(totalDurationSeconds)}
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-[#b8aa91]">
              Um dia inteiro de música contínua. A coleção já ocupa mais tempo
              do que uma maratona de doze filmes.
            </p>
            {albumsWithDuration.length < collectionSeed.length && (
              <p className="mt-3 text-xs text-[#9d9079]">
                Baseado em {albumsWithDuration.length} de{" "}
                {collectionSeed.length} discos com duração disponível.
              </p>
            )}
          </div>

          <div>
            <div className="flex h-16 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {durationByGenre.map((item) => (
                <div
                  key={item.name}
                  title={`${item.name}: ${formatTotalDuration(item.seconds)}`}
                  className="relative min-w-2 transition hover:brightness-125"
                  style={{
                    width: `${(item.seconds / totalDurationSeconds) * 100}%`,
                    background: GENRE_COLORS[item.name],
                  }}
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {durationByGenre.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: GENRE_COLORS[item.name] }}
                    />
                    <span className="text-xs text-[#9d9079]">{item.name}</span>
                  </div>
                  <p className="mt-2 font-black">
                    {formatTotalDuration(item.seconds)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="ACERVO"
          title="O valor por trás da história."
          description="A dimensão financeira permanece privada, mas integrada à mesma leitura da coleção."
        />

        {vaultUnlocked ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MetricCard
              eyebrow="Valor estimado"
              value={`R$ ${totalValue.toLocaleString("pt-BR")}`}
              detail="valor médio atual da coleção"
              accent="#f5c400"
            />
            <MetricCard
              eyebrow="Média por disco"
              value={`R$ ${averageValue.toLocaleString("pt-BR")}`}
              detail={`${albums.length} discos avaliados`}
              accent="#a347b6"
            />
            <MetricCard
              eyebrow="Maior valor"
              value={`TD-${mostValuable.catalog}`}
              detail={mostValuable.artist}
              accent="#45a65a"
            />
          </div>
        ) : (
          <Link
            href="/vault/login?from=/insights"
            className="mt-6 flex items-center justify-between gap-4 rounded-3xl border border-[#3a3025] bg-[#11100e] p-5 transition hover:border-purple-500"
          >
            <div>
              <p className="text-sm text-[#9d9079]">Dados financeiros</p>
              <p className="mt-1 text-2xl font-black">Área protegida</p>
            </div>
            <span className="rounded-full bg-purple-950 px-4 py-2 text-sm text-purple-300">
              Desbloquear →
            </span>
          </Link>
        )}
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="CONTINUE EXPLORANDO"
          title="Cada gráfico abre outro caminho."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/timeline",
              title: "Linha do Tempo",
              text: "Os discos, ano após ano.",
            },
            {
              href: "/universe",
              title: "Universo",
              text: "As constelações da coleção.",
            },
            {
              href: "/world",
              title: "Mundo",
              text: "Cenas, países e deslocamentos.",
            },
            {
              href: "/journey",
              title: "Jornada",
              text: "A história na ordem do arquivo.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-[#2b241c] bg-[#11100e] p-5 transition hover:-translate-y-1 hover:border-brand-yellow"
            >
              <span className="text-purple-400 transition group-hover:text-brand-yellow">
                ↗
              </span>
              <p className="mt-8 text-2xl font-black">{item.title}</p>
              <p className="mt-2 text-sm text-[#9d9079]">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold tracking-[0.32em] text-purple-400">
        {kicker}
      </p>
      <h2 className="mt-3 text-4xl font-black leading-none sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl leading-relaxed text-[#9d9079]">
          {description}
        </p>
      )}
    </div>
  );
}

function ChartCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`premium-card min-w-0 overflow-hidden rounded-[2rem] border border-[#2b241c] bg-[#11100e] p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function MetricCard({
  eyebrow,
  value,
  detail,
  accent,
}: {
  eyebrow: string;
  value: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="relative min-h-36 overflow-hidden rounded-3xl border border-[#2b241c] bg-[#11100e] p-4 sm:p-5">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
      />
      <p className="text-xs text-[#9d9079]">{eyebrow}</p>
      <p className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#776d5d]">{detail}</p>
    </div>
  );
}
