import Link from "next/link";
import { collectionSeed } from "../data/seed";
import BottomNav from "../components/BottomNav";

const journey = [
  { catalog: "001", chapter: "Origem brasileira", connection: "abre a porta" },
  { catalog: "002", chapter: "Raiz jamaicana", connection: "leva para a Jamaica" },
  { catalog: "007", chapter: "Jamaica encontra Nova York", connection: "faz a virada" },
  { catalog: "008", chapter: "Linguagem do hip-hop", connection: "estrutura a palavra" },
  { catalog: "013", chapter: "Ponte para o jazz", connection: "revela a fonte" },
  { catalog: "014", chapter: "Entrada no jazz", connection: "volta à origem musical" },
  { catalog: "019", chapter: "Brasil global", connection: "fecha o ciclo" },
];

export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-[#080706] text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">← Coleção</Link>

      <section className="mt-8 mb-10">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          JORNADA DA COLEÇÃO
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          Um disco leva ao próximo.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          A fundação 001–019 contada como uma sequência de ideias musicais.
        </p>
      </section>

      <section className="space-y-5">
        {journey.map((step, index) => {
          const album = collectionSeed.find((item) => item.catalog === step.catalog);

          if (!album) return null;

          return (
            <div key={step.catalog}>
              <Link
                href={`/album/${album.catalog}`}
                className="block rounded-3xl border border-[#2b241c] bg-[#11100e] p-5 hover:border-purple-500"
              >
                <p className="text-purple-400">TD-{album.catalog}</p>

                <h2 className="text-3xl font-black mt-2">{step.chapter}</h2>

                <p className="text-xl font-bold mt-3">{album.artist}</p>

                <p className="text-[#b8aa91]">{album.album}</p>

                <p className="text-[#9d9079] mt-4">{album.note}</p>
              </Link>

              {index < journey.length - 1 && (
                <div className="flex justify-center my-4">
                  <span className="rounded-full border border-purple-700 px-4 py-2 text-purple-400">
                    ↓ {step.connection}
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