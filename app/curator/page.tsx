import Link from "next/link";
import { albums } from "../data/albums";
import { notes } from "../data/notes";
import BottomNav from "../components/BottomNav";

export default function CuratorPage() {
  const albumOfWeek = albums.find((album) => album.catalog === "007") || albums[0];
  const bridgeAlbum = albums.find((album) => album.catalog === "013") || albums[0];
  const brasilAlbum = albums.find((album) => album.catalog === "019") || albums[0];

  const albumNote = notes[albumOfWeek.catalog as keyof typeof notes];

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          CURADORIA IA
        </p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          Curadoria da semana.
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Uma leitura editorial automática da fundação 001–019.
        </p>
      </section>

      <section className="rounded-[2rem] border border-purple-800 bg-purple-950/20 p-6 mb-8">
        <p className="text-sm tracking-[0.3em] text-purple-400">
          DISCO DA SEMANA
        </p>

        <h2 className="text-5xl font-black mt-4">
          TD-{albumOfWeek.catalog}
        </h2>

        <h3 className="text-3xl font-black mt-3">
          {albumOfWeek.artist}
        </h3>

        <p className="text-[#b8aa91] mt-2">
          {albumOfWeek.album}
        </p>

        <p className="text-[#b8aa91] mt-5 leading-relaxed">
          {albumNote?.note}
        </p>

        <Link
          href={`/album/${albumOfWeek.catalog}`}
          className="inline-block mt-6 rounded-full border border-purple-500 px-5 py-2 text-purple-300"
        >
          Abrir disco →
        </Link>
      </section>

      <section className="grid gap-4">
        <CuratorCard
          title="Ponte da coleção"
          album={bridgeAlbum}
          text="O disco que transforma influência em passagem narrativa: hip-hop encontra jazz de forma explícita."
        />

        <CuratorCard
          title="Brasil global"
          album={brasilAlbum}
          text="O ponto em que a coleção retorna ao Brasil por uma rota internacional, entre bossa, jazz e pop."
        />

        <section className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-5">
          <p className="text-sm tracking-[0.3em] text-yellow-400">
            GÊNERO EM DESTAQUE
          </p>

          <h2 className="text-3xl font-black mt-3">
            Jazz Rap
          </h2>

          <p className="text-[#b8aa91] mt-3">
            A região mais fértil da coleção agora é a ponte entre batida, sample,
            improviso e memória musical.
          </p>
        </section>
      </section>

      <BottomNav />
    </main>
  );
}

function CuratorCard({
  title,
  album,
  text,
}: {
  title: string;
  album: any;
  text: string;
}) {
  return (
    <section className="rounded-3xl border border-[#2b241c] bg-[#11100e] p-5">
      <p className="text-sm tracking-[0.3em] text-purple-400">
        {title.toUpperCase()}
      </p>

      <h2 className="text-3xl font-black mt-3">
        TD-{album.catalog}
      </h2>

      <h3 className="text-2xl font-black mt-2">
        {album.artist}
      </h3>

      <p className="text-[#b8aa91]">
        {album.album}
      </p>

      <p className="text-[#b8aa91] mt-4">
        {text}
      </p>

      <Link
        href={`/album/${album.catalog}`}
        className="inline-block mt-5 text-purple-400"
      >
        Abrir →
      </Link>
    </section>
  );
}