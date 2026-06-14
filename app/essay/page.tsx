import Link from "next/link";
import { collectionStats, collectionScore } from "../data/seed";
import BottomNav from "../components/BottomNav";

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

        <p className="text-[#b8aa91] text-xl mt-6 leading-relaxed">
          Ela é sobre conexões.
        </p>

        <section className="mt-10 space-y-6 text-[#d8ccb4] leading-relaxed text-lg">
          <p>
            A fundação 001–019 começa no Brasil, atravessa a música jamaicana,
            encontra Nova York pelo hip-hop, abre passagem para o jazz e retorna
            ao Brasil por uma rota internacional.
          </p>

          <p>
            Cada disco ocupa uma função dentro da narrativa. Alguns abrem portas.
            Outros fazem pontes. Alguns consolidam blocos inteiros da escuta.
          </p>

          <p>
            O Terdam Dog Archive existe para mostrar que uma coleção pode ser
            mais do que um inventário. Ela pode ser uma forma de pensamento
            musical.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4 mt-10">
          <Card title="Discos" value={collectionStats.totalAlbums} />
          <Card title="Faixas" value={collectionStats.totalTracks} />
          <Card title="Países" value={collectionStats.countries.length} />
          <Card title="Índice" value={`${collectionScore}/100`} />
        </section>

        <section className="mt-10 rounded-3xl border border-purple-800 bg-purple-950/20 p-6">
          <p className="text-sm tracking-[0.3em] text-purple-400">
            QUATRO PILARES
          </p>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <Pillar icon="🌴" title="Reggae" />
            <Pillar icon="🎤" title="Hip-Hop" />
            <Pillar icon="🎷" title="Jazz" />
            <Pillar icon="🇧🇷" title="Brasil" />
          </div>
        </section>
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

function Pillar({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="rounded-3xl border border-[#2b241c] bg-brand-black p-4">
      <p className="text-3xl">{icon}</p>
      <p className="font-black mt-3">{title}</p>
    </div>
  );
}