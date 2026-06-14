import Link from "next/link";
import { albums } from "../data/albums";
import BottomNav from "../components/BottomNav";
import { genreColor } from "../lib/genreColor";

function countBy<T extends Record<string, any>>(items: T[], field: keyof T) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = String(item[field] || "Não informado");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export default function HeatmapPage() {
  const byGenre = countBy(albums, "genre");
  const byCountry = countBy(albums, "country");
  const byRole = countBy(albums, "role");

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">← Coleção</Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          MAPA DE CALOR DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          Onde a coleção pulsa.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Uma leitura visual de concentração por gênero, país e papel narrativo.
        </p>
      </section>

      <HeatSection title="Gêneros" data={byGenre} accentFor={genreColor} />
      <HeatSection title="Países" data={byCountry} />
      <HeatSection title="Papéis narrativos" data={byRole} />

      <BottomNav />
    </main>
  );
}

function HeatSection({
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
    <section className="mt-10 rounded-3xl border border-[#2b241c] bg-[#11100e] p-5">
      <h2 className="text-3xl font-black mb-5">{title}</h2>

      <div className="space-y-5">
        {Object.entries(data).map(([key, value]) => {
          const width = `${(value / max) * 100}%`;
          const accent = accentFor?.(key) ?? {
            bg: "bg-purple-500",
            text: "text-purple-400",
          };

          return (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="font-bold">{key}</span>
                <span className={`${accent.text} font-black`}>{value}</span>
              </div>

              <div className="h-4 rounded-full bg-brand-black overflow-hidden">
                <div
                  className={`h-4 rounded-full ${accent.bg}`}
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