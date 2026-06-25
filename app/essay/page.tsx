import Link from "next/link";
import BottomNav from "../components/BottomNav";
import CoverImage from "../components/CoverImage";
import { collectionSeed, collectionStats } from "../data/seed";
import { captions } from "../data/captions";
import { getPrimaryGenre } from "../lib/genreGroup";

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0
    ? `${hours}h${String(minutes).padStart(2, "0")}min`
    : `${minutes}min`;
};

const PILLAR_DEFS = [
  {
    title: "Reggae",
    icon: "🌴",
    border: "border-green-700",
    text: "text-green-400",
    prose:
      "Da Jamaica ao mundo. Raízes, espiritualidade e consciência social como base da primeira grande travessia.",
  },
  {
    title: "Hip-Hop",
    icon: "🎤",
    border: "border-purple-700",
    text: "text-purple-300",
    prose:
      "Nova York e a palavra como arquitetura. A rua encontra técnica, consciência, humor e invenção.",
  },
  {
    title: "Jazz",
    icon: "🎷",
    border: "border-yellow-700",
    text: "text-yellow-400",
    prose:
      "Improviso, estrutura e fonte. O som que já existia dentro da batida aparece inteiro diante da coleção.",
  },
  {
    title: "Brasil",
    icon: "🇧🇷",
    border: "border-red-800",
    text: "text-red-400",
    prose:
      "Origem e retorno. Um país que entra na coleção, atravessa o mundo e volta falando com a própria voz.",
  },
  {
    title: "Samba e Pagode",
    icon: "🥁",
    border: "border-orange-600",
    text: "text-orange-400",
    prose:
      "O quinto território nasceu com o crescimento do arquivo: memória, cidade, ancestralidade e invenção coletiva.",
  },
];

const ACTS = [
  {
    number: "01",
    eyebrow: "O PONTO DE PARTIDA",
    title: "Toda coleção começa revelando quem escuta.",
    prose: [
      "A Terdam Dog começa no Brasil, mas nunca permanece parada. Black Alien abre o arquivo com palavra, rua e imaginação sonora — e já carrega no próprio título uma referência direta ao reggae.",
      "O primeiro disco não funciona apenas como estreia. Ele contém uma pergunta: quais caminhos aparecem quando a escuta deixa de respeitar fronteiras de gênero, país ou década?",
    ],
    catalogs: ["001", "002"],
    quoteCatalog: "001",
    cta: { label: "Começar pela origem", href: "/album/001" },
  },
  {
    number: "02",
    eyebrow: "AS PONTES",
    title: "Um disco não termina quando o próximo começa.",
    prose: [
      "A Jamaica atravessa o Atlântico, chega à África e encontra Nova York. Shinehead ocupa o centro dessa passagem porque não escolhe entre dancehall e hip-hop: ele prova que os dois pertencem à mesma conversa.",
      "Depois, o rap encontra o jazz que já vivia dentro de suas batidas. Guru torna a ponte explícita e Sonny Rollins leva a coleção de volta à fonte.",
    ],
    catalogs: ["007", "013", "014"],
    quoteCatalog: "007",
    cta: { label: "Percorrer a sequência principal", href: "/journey" },
  },
  {
    number: "03",
    eyebrow: "O RETORNO",
    title: "Voltar para casa não significa voltar ao mesmo lugar.",
    prose: [
      "Sergio Mendes apresenta um Brasil traduzido para o mundo. Jorge Ben responde sem pedir tradução. A coleção retorna ao país de origem por uma rota internacional, agora carregando reggae, hip-hop e jazz dentro da escuta.",
      "Esse retorno abre espaço para olhar mais fundo: Caymmi, Adoniran, Cartola, Moreira da Silva, Fundo de Quintal, Beth Carvalho e Clara Nunes deixam de ser apenas referências históricas. Tornam-se a estrutura que sustenta tudo.",
    ],
    catalogs: ["019", "020", "025"],
    quoteCatalog: "020",
    cta: { label: "Explorar as referências", href: "/journey#referencias" },
  },
  {
    number: "04",
    eyebrow: "A HISTÓRIA EM ABERTO",
    title: "O arquivo cresce quando uma resposta produz outra pergunta.",
    prose: [
      "Jimmy Cliff fecha um círculo entre Jamaica e Bahia. Rita Marley abre outro: o das vozes que sustentaram a revolução do reggae por dentro, muitas vezes longe do centro do palco.",
      "A coleção termina, por enquanto, no disco 036. Não existe conclusão definitiva. Existe uma direção — e a consciência de que cada nova entrada reorganiza todas as anteriores.",
    ],
    catalogs: ["035", "036"],
    quoteCatalog: "036",
    cta: { label: "Ver o que ainda falta", href: "/discover" },
  },
];

export default function EssayPage() {
  const pillars = PILLAR_DEFS.map((definition, index) => {
    const items = collectionSeed.filter((album) => {
      const primary = getPrimaryGenre(album);
      if (definition.title === "Samba e Pagode") {
        const genre = `${album.genre} ${album.subgenre}`.toLowerCase();
        return genre.includes("samba") || genre.includes("pagode");
      }

      if (definition.title === "Brasil") {
        return (
          primary === "MPB/Samba" &&
          !`${album.genre} ${album.subgenre}`.toLowerCase().match(/samba|pagode/)
        );
      }

      return primary === definition.title;
    });

    const seconds = items.reduce(
      (total, album) => total + (album.totalDurationSeconds || 0),
      0
    );

    return {
      number: String(index + 1).padStart(2, "0"),
      ...definition,
      count: items.length,
      duration: formatDuration(seconds),
    };
  });

  return (
    <main className="reading-page min-h-screen bg-brand-black p-5 pb-32 text-[#f4ead8] sm:p-6">
      <Link href="/" className="text-purple-300">
        ← Coleção
      </Link>

      <article className="mt-8">
        <header>
          <p className="text-sm tracking-[0.35em] text-purple-300">
            ENSAIO DA COLEÇÃO
          </p>

          <h1 className="mt-3 text-5xl font-black leading-[0.95] sm:text-6xl">
            A coleção Terdam Dog não é sobre raridade.
          </h1>

          <p className="my-12 font-display text-3xl leading-tight text-brand-yellow sm:text-4xl">
            Ela é sobre conexões.
          </p>

          <div className="h-px bg-gradient-to-r from-brand-green to-brand-purple opacity-40" />

          <p className="mt-10 max-w-2xl text-xl leading-relaxed text-[#d8ccb4]">
            {collectionStats.totalAlbums} discos não formam apenas uma lista.
            Formam uma maneira de atravessar países, décadas e linguagens sem
            separar o que a música sempre manteve em conversa.
          </p>
        </header>

        <div className="mt-16 space-y-20">
          {ACTS.map((act) => (
            <EssayAct key={act.number} {...act} />
          ))}
        </div>

        <section className="-mx-5 mt-20 bg-[#11100e] px-5 py-12 sm:-mx-6 sm:px-6">
          <p className="text-sm tracking-[0.3em] text-purple-300">
            OS TERRITÓRIOS DA ESCUTA
          </p>

          <h2 className="mt-3 text-4xl font-black leading-none">
            Quatro pilares abriram o arquivo. O crescimento revelou um quinto.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-[#b8aa91]">
            Reggae, Hip-Hop, Jazz e Brasil continuam sendo a fundação. Mas a
            sequência de referências brasileiras ganhou peso suficiente para
            formar seu próprio território: Samba e Pagode, não como apêndice,
            mas como linguagem viva.
          </p>

          <div className="mt-8 space-y-4">
            {pillars.map((pillar) => (
              <Pillar key={pillar.title} {...pillar} />
            ))}
          </div>
        </section>

        <footer className="py-20 text-center">
          <p className="font-display text-3xl leading-tight text-brand-yellow sm:text-4xl">
            Uma coleção não precisa apenas guardar música.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#d8ccb4]">
            Ela pode revelar como uma pessoa escuta, conecta e organiza o
            mundo. Ela pode ser uma forma de pensamento musical.
          </p>

          <Link
            href="/journey"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full border border-brand-yellow px-6 text-sm text-brand-yellow transition hover:bg-brand-yellow hover:text-black"
          >
            Começar a jornada →
          </Link>
        </footer>
      </article>

      <BottomNav />
    </main>
  );
}

function EssayAct({
  number,
  eyebrow,
  title,
  prose,
  catalogs,
  quoteCatalog,
  cta,
}: (typeof ACTS)[number]) {
  const albums = catalogs
    .map((catalog) => collectionSeed.find((album) => album.catalog === catalog))
    .filter((album): album is (typeof collectionSeed)[number] => Boolean(album));

  const quoteAlbum = collectionSeed.find(
    (album) => album.catalog === quoteCatalog
  );
  const thesis = captions[quoteCatalog as keyof typeof captions]?.tese;

  return (
    <section>
      <div className="flex items-center gap-4">
        <span className="font-display text-5xl text-[#3f372d]">{number}</span>
        <div>
          <p className="text-sm tracking-[0.25em] text-purple-300">{eyebrow}</p>
          <h2 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">
            {title}
          </h2>
        </div>
      </div>

      <div className={`mt-8 grid gap-4 ${albums.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {albums.map((album) => (
          <Link key={album.catalog} href={`/album/${album.catalog}`} className="group">
            <div className="aspect-square overflow-hidden rounded-2xl border border-[#2b241c] transition group-hover:border-purple-500">
              <CoverImage album={album} />
            </div>
            <p className="mt-2 text-sm text-purple-300">TD-{album.catalog}</p>
            <p className="text-sm font-black leading-tight">{album.artist}</p>
            <p className="line-clamp-1 text-sm text-[#9d9079]">{album.album}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#d8ccb4]">
        {prose.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {quoteAlbum && thesis && (
        <blockquote className="mt-8 border-l-[3px] border-brand-purple bg-[#11100e] px-5 py-6">
          <p className="font-display text-2xl leading-tight text-brand-cream">
            “{thesis}”
          </p>
          <p className="mt-3 text-sm tracking-[0.16em] text-purple-300">
            TD-{quoteAlbum.catalog} · {quoteAlbum.artist}
          </p>
        </blockquote>
      )}

      <Link href={cta.href} className="mt-6 inline-block text-sm text-purple-300">
        {cta.label} →
      </Link>
    </section>
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
    <div className={`grid grid-cols-[auto_1fr] gap-4 border-l-4 ${border} bg-[#0d0c0b] p-5`}>
      <div>
        <p className="text-2xl" aria-hidden="true">{icon}</p>
        <p className={`mt-2 font-display text-2xl ${text}`}>{number}</p>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={`text-2xl font-black ${text}`}>{title}</h3>
          <p className="text-sm text-[#9d9079]">
            {count} discos · {duration}
          </p>
        </div>
        <p className="mt-2 text-base leading-relaxed text-[#b8aa91]">{prose}</p>
      </div>
    </div>
  );
}
