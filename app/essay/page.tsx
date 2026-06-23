import Link from "next/link";
import { collectionSeed, collectionStats } from "../data/seed";
import { captions } from "../data/captions";
import BottomNav from "../components/BottomNav";

// Bucket único por disco (partição exclusiva → contagens somam o total).
const bucketOf = (album: (typeof collectionSeed)[number]) => {
  const g = album.genre.toLowerCase();
  if (g.includes("reggae")) return "Reggae";
  if (g.includes("hip-hop")) return "Hip-Hop";
  if (g.includes("jazz")) return "Jazz";
  if (g.includes("samba") || g.includes("pagode")) return "Pagode/Samba";
  if (album.country.toLowerCase().includes("brasil")) return "Brasil";
  return null;
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}min` : `${m}min`;
};

const PILLAR_DEFS = [
  { title: "Reggae", icon: "🌴", border: "border-green-700", text: "text-green-400", prose: "Da Jamaica ao mundo. Raízes, espiritualidade e consciência social como base de toda a jornada." },
  { title: "Hip-Hop", icon: "🎤", border: "border-purple-700", text: "text-purple-400", prose: "Nova York e a palavra como arquitetura — da golden age em diante." },
  { title: "Jazz", icon: "🎷", border: "border-yellow-700", text: "text-yellow-400", prose: "Improviso, estrutura e a fonte que atravessa reggae e hip-hop por dentro." },
  { title: "Brasil", icon: "🇧🇷", border: "border-red-800", text: "text-red-400", prose: "Origem e retorno. O Brasil entrando e saindo da coleção por rotas internacionais." },
  { title: "Pagode/Samba", icon: "🥁", border: "border-orange-600", text: "text-orange-400", prose: "Raiz, memória e invenção. Do samba-de-breque ao pagode, a linguagem viva do Brasil." },
];

export default function EssayPage() {
  const PILLARS = PILLAR_DEFS.map((def, i) => {
    const items = collectionSeed.filter((a) => bucketOf(a) === def.title);
    const seconds = items.reduce((sum, a) => sum + (a.totalDurationSeconds || 0), 0);
    return {
      number: String(i + 1).padStart(2, "0"),
      ...def,
      count: items.length,
      duration: formatDuration(seconds),
    };
  });

  // Teses reais usadas como exemplos vivos dentro do manifesto.
  const manifestoExamples = [
    { clause: "abrem portas", tese: captions["001"].tese, ref: "TD-001" },
    { clause: "fazem pontes", tese: captions["007"].tese, ref: "TD-007" },
    { clause: "conversam de igual para igual com o mundo", tese: captions["020"].tese, ref: "TD-020" },
  ];

  // Sequências narrativas calculadas dinamicamente a partir do catálogo atual.
  const principal = collectionSeed.filter((a) => a.catalog <= "024");
  const referencias = collectionSeed.filter((a) => a.role === "Referência");
  const viradas = collectionSeed.filter((a) => a.role === "Virada");
  const marley = collectionSeed.filter((a) => a.role === "Família Marley");

  const hint = (list: typeof collectionSeed) =>
    list.length === 0
      ? "—"
      : `${list[0].catalog}–${list[list.length - 1].catalog}`;

  const SEQUENCES = [
    {
      title: "Sequência Principal",
      hint: hint(principal),
      count: principal.length,
      accent: "border-purple-700 text-purple-400",
      role: "A espinha dorsal: do Brasil ao reggae, ao hip-hop, ao jazz — e a volta para casa.",
    },
    {
      title: "Referências",
      hint: hint(referencias),
      count: referencias.length,
      accent: "border-yellow-700 text-yellow-400",
      role: "Raízes atemporais que ancoram a coleção antes do hit e da rádio.",
    },
    {
      title: "Viradas",
      hint: viradas.map((a) => a.catalog).join(" · ") || "—",
      count: viradas.length,
      accent: "border-green-700 text-green-400",
      role: "Os discos onde a narrativa muda de direção.",
    },
    {
      title: "Família Marley",
      hint: marley.length ? `${marley[0].catalog}+` : "—",
      count: marley.length,
      accent: "border-orange-600 text-orange-400",
      role: "O novo capítulo: a família que sustentou o reggae por dentro.",
    },
  ];

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
            {collectionStats.totalAlbums} discos. Uma narrativa. A coleção
            começa no Brasil, atravessa a música jamaicana, encontra Nova York
            pelo hip-hop, abre passagem para o jazz e retorna ao Brasil.
          </p>

          <p>
            Depois, ela mergulha nas raízes. {referencias.length} discos de
            Referência — Caymmi, Adoniran, Cartola, o samba-de-breque, o pagode —
            ancoram tudo o que veio antes em algo atemporal.
          </p>

          <p>
            E então a coleção dá a volta. Jimmy Cliff reconduz a escuta de volta
            à Jamaica, fechando o círculo do reggae. E um novo capítulo se abre:
            a Família Marley começa com Rita Marley —{" "}
            {marley.length === 1
              ? "o primeiro disco"
              : `${marley.length} discos`}{" "}
            de uma história que ainda está sendo escrita.
          </p>

          <blockquote className="border-l-[3px] border-brand-purple bg-[#111111] pl-5 py-4 text-lg">
            <p className="text-brand-cream italic">
              Cada disco ocupa uma função. Alguns abrem portas. Outros fazem
              pontes. Outros conversam de igual para igual com o mundo.
            </p>

            <div className="mt-5 space-y-4">
              {manifestoExamples.map((ex) => (
                <div key={ex.ref}>
                  <p className="text-sm italic text-[#d8ccb4]">
                    &ldquo;{ex.tese}&rdquo;
                  </p>
                  <p className="text-[11px] tracking-[0.2em] text-purple-400 mt-1">
                    — {ex.ref} · {ex.clause}
                  </p>
                </div>
              ))}
            </div>
          </blockquote>
        </section>

        <div className="h-px mt-10 bg-gradient-to-r from-brand-green to-brand-purple opacity-30" />

        <section className="mt-10">
          <p className="text-sm tracking-[0.3em] text-purple-400">
            SEQUÊNCIAS DA COLEÇÃO
          </p>

          <p className="text-[#b8aa91] mt-3">
            As camadas narrativas que organizam os {collectionStats.totalAlbums}{" "}
            discos.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {SEQUENCES.map((seq) => (
              <SequenceCard key={seq.title} {...seq} />
            ))}
          </div>
        </section>

        <div className="h-px mt-10 bg-gradient-to-r from-brand-green to-brand-purple opacity-30" />

        <section className="-mx-5 mt-10 bg-[#111111] px-5 py-10">
          <p className="text-sm tracking-[0.3em] text-purple-400">
            CINCO PILARES
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {PILLARS.map((pillar, i) => (
              <div key={pillar.title} className={i === PILLARS.length - 1 && PILLARS.length % 2 !== 0 ? "col-span-2" : ""}>
                <Pillar {...pillar} />
              </div>
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

function SequenceCard({
  title,
  hint,
  count,
  accent,
  role,
}: {
  title: string;
  hint: string;
  count: number;
  accent: string;
  role: string;
}) {
  const [border, text] = accent.split(" ");

  return (
    <div className={`rounded-3xl border-[1.5px] ${border} bg-brand-black p-4`}>
      <div className="flex items-baseline justify-between">
        <p className={`font-display text-xl ${text}`}>{title}</p>
        <p className={`font-display text-3xl ${text}`}>{count}</p>
      </div>

      <p className="text-[10px] tracking-[0.2em] text-[#9d9079] mt-1">{hint}</p>

      <p className="mt-3 text-sm text-[#b8aa91] leading-relaxed">{role}</p>
    </div>
  );
}

function Pillar({
  number,
  icon,
  title,
  border,
  text,
  prose,
  count,
  duration,
}: {
  number: string;
  icon: string;
  title: string;
  border: string;
  text: string;
  prose: string;
  count: number;
  duration: string;
}) {
  return (
    <div className={`h-full rounded-2xl border-l-4 ${border} bg-[#0d0c0b] p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-3xl">{icon}</p>
        <p className={`font-display text-2xl ${text}`}>{number}</p>
      </div>

      <p className={`font-display text-xl mt-3 ${text}`}>{title}</p>

      <p className="text-[11px] tracking-[0.15em] text-[#9d9079] mt-1">
        {count} discos · {duration}
      </p>

      <p className="mt-2 text-sm text-[#b8aa91] leading-relaxed">{prose}</p>
    </div>
  );
}
