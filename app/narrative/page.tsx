import Link from "next/link";
import { albums } from "../data/albums";
import { notes } from "../data/notes";
import BottomNav from "../components/BottomNav";

type NarrativeNote = {
  note: string;
  story: string;
  previous?: string;
  next?: string;
};

export default function NarrativePage() {
  return (
    <main className="min-h-screen bg-[#080706] text-[#f4ead8] p-5 pb-32">
      <section className="mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">
          NARRATIVE GRAPH
        </p>

        <h1 className="text-5xl font-black mt-3">
          Como a coleção se conecta.
        </h1>

        <p className="text-[#b8aa91] mt-4">
          Não é uma lista de discos. É uma sequência de ideias.
        </p>
      </section>

      <div className="space-y-8">
        {albums.map((album) => {
          const note = notes[
            album.catalog as keyof typeof notes
          ] as NarrativeNote | undefined;

          return (
            <div
              key={album.catalog}
              className="rounded-3xl border border-[#2b241c] p-5 bg-[#11100e]"
            >
              <Link href={`/album/${album.catalog}`}>
                <p className="text-purple-400">TD-{album.catalog}</p>

                <h2 className="text-2xl font-black mt-2">
                  {album.artist}
                </h2>

                <p className="text-[#b8aa91]">{album.album}</p>
              </Link>

              <div className="mt-5 rounded-2xl bg-[#080706] p-4">
                <p className="text-xs tracking-[0.25em] text-purple-400">
                  STORY
                </p>

                <p className="mt-2 font-black">
                  {note?.story || album.role}
                </p>

                <p className="text-[#b8aa91] mt-3">
                  {note?.note}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {note?.previous && (
                  <Link
                    href={`/album/${note.previous}`}
                    className="rounded-2xl border border-[#2b241c] p-3 hover:border-purple-500"
                  >
                    <p className="text-sm text-[#9d9079]">Anterior</p>
                    <p className="font-black">TD-{note.previous}</p>
                  </Link>
                )}

                {note?.next && (
                  <Link
                    href={`/album/${note.next}`}
                    className="rounded-2xl border border-[#2b241c] p-3 hover:border-purple-500"
                  >
                    <p className="text-sm text-[#9d9079]">Próximo</p>
                    <p className="font-black">TD-{note.next}</p>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </main>
  );
}