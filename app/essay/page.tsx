import Link from "next/link";
import { collectionStats, collectionScore } from "../data/seed";
import BottomNav from "../components/BottomNav";
import { genreColor } from "../lib/genreColor";

const PILLARS = [
  {
    number: "01",
    icon: "🌴",
    title: "Reggae",
    accent: genreColor("Reggae"),
    description:
      "Da Jamaica ao mundo. Raízes, espiritualidade e consciência social como base de toda a jornada.",
  },
  {
    number: "02",
    icon: "🎤",
    title: "Hip-Hop",
    accent: genreColor("Hip-Hop"),
    description:
      "Nova York, a palavra como arquitetura e a evolução da golden age até os dias de hoje.",
  },
  {
    number: "03",
    icon: "🎷",
    title: "Jazz",
    accent: genreColor("Jazz"),
    description:
      "Improviso, estrutura e a fonte que atravessa reggae e hip-hop por dentro.",
  },
  {
    number: "04",
    icon: "🇧🇷",
    title: "Brasil",
    accent: genreColor("Brasil"),
    description:
      "Origem e retorno. O Brasil entrando e saindo da coleção por rotas internacionais.",
  },
];

export default function EssayPage() {
  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">← Coleção</Link>

      <article className="mt-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          ENSAIO DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          A coleção Terdam Dog não é sobre raridade.
        </h1>

        <p className="font-display text-3xl text-brand-yellow my-12 leading-tight">
          Ela é sobre conexões.
        </p>

        <div className="h-px bg-gradient-to-r from-brand-green to-brand-purple opacity-30" />

        <section className="mt-10 space-y-8 text-[#d8ccb4] leading-relaxed text-lg">
          <p>
            20 discos. Uma narrativa. A coleção começa no Brasil, atravessa a
            música jamaicana, encontra Nova York pelo hip-hop, abre passagem
            para o jazz e retorna ao Brasil por uma rota internacional.
          </p>

          <p>
            Cada disco ocupa uma função dentro da narrativa.
          </p>

          <blockquote className="border-l-[3px] border-brand-purple bg-[#111111] pl-5 py-4 text-brand-cream italic text-lg">
            Alguns abrem portas. Outros fazem pontes. Alguns consolidam
            blocos inteiros da escuta.
          </blockquote>
        </section>

        <div className="h-px mt-10 bg-gradient-to-r from-brand-green to-brand-purple opacity-30" />

        <section className="mt-10 space-y-8 text-[#d8ccb4] leading-relaxed text-lg">
          <p>
            O Terdam Dog Archive existe para mostrar que uma coleção pode ser
            mais do que um inventário.
          </p>
        </section>

        <div className="h-px mt-10 bg-gradient-to-r from-brand-green to-brand-purple opacity-30" />

        <section className="grid grid-cols-2 gap-4 mt-10">
          <Card title="Discos" value={collectionStats.totalAlbums} />
          <Card title="Faixas" value={collectionStats.totalTracks} />
          <Card title="Países" value={collectionStats.countries.length} />
          <Card title="Índice" value={`${collectionScore}/100`} />
        </section>

        <div className="h-px mt-10 bg-gradient-to-r from-brand-green to-brand-purple opacity-30" />

        <section className="-mx-5 mt-10 bg-[#111111] px-5 py-10">
          <p className="text-sm tracking-[0.3em] text-purple-400">
            QUATRO PILARES
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {PILLARS.map((pillar) => (
              <Pillar key={pillar.title} {...pillar} />
            ))}
          </div>
        </section>

        <p className="font-display text-3xl text-brand-yellow text-center mt-16 leading-tight">
          Ela pode ser uma forma de pensamento musical.
        </p>
      </article>

      <BottomNav />
    </main>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-4">
      <p className="text-sm text-[#9d9079]">{title}</p>
      <p className="text-3xl font-black mt-2">{value}</p>
    </div>
  );
}

function Pillar({
  number,
  icon,
  title,
  accent,
  description,
}: {
  number: string;
  icon: string;
  title: string;
  accent: { border: string; text: string };
  description: string;
}) {
  return (
    <div className={`rounded-3xl border-[1.5px] ${accent.border} bg-brand-black p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-3xl">{icon}</p>
        <p className={`font-display text-2xl ${accent.text}`}>{number}</p>
      </div>

      <p className={`font-display text-xl mt-3 ${accent.text}`}>{title}</p>

      <p className="mt-2 text-sm text-[#b8aa91] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
