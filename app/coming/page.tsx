import Link from "next/link";
import { albums } from "../data/albums";
import { getDiscogsCollection, type DiscogsItem } from "../lib/discogs";
import BottomNav from "../components/BottomNav";
import FadeIn from "../components/FadeIn";

export const dynamic = "force-dynamic";

// Discos com título no Discogs muito diferente do título cadastrado.
const TITLE_ALIASES: Record<string, string[]> = {
  "019": ["Herb Alpert Apresenta Sergio Mendes & Brasil '66"],
  "026": ["Ary Caymmi Dorival Barroso"],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\bvolume\b/g, "vol")
    .replace(/[^a-z0-9]/g, "");
}

// Verifica se um item da coleção Discogs já está coberto em albums.ts.
// Usado apenas para filtrar itens "por vir" — não define o que é "publicado".
function isCovered(item: DiscogsItem): boolean {
  // Primário: match por release ID
  if (item.releaseId > 0 && albums.some((a) => a.discogsId === item.releaseId)) {
    return true;
  }

  // Fallback: match fuzzy por título + artista
  const itemArtist = normalize(item.artist);
  const itemTitle = normalize(item.title);
  const itemArtistParts = item.artist.split(", ").map(normalize);

  return albums.some((album) => {
    const albumArtist = normalize(album.artist);
    const albumTitles = [album.album, ...(TITLE_ALIASES[album.catalog] ?? [])].map(normalize);

    const titleMatches = albumTitles.some(
      (t) => t === itemTitle || t.includes(itemTitle) || itemTitle.includes(t)
    );
    if (!titleMatches) return false;

    if (albumArtist === "variousartists" || albumArtist === "various") return true;

    return (
      albumArtist === itemArtist ||
      albumArtist.includes(itemArtist) ||
      itemArtist.includes(albumArtist) ||
      (itemArtistParts.length > 1 &&
        itemArtistParts.every((part) => albumArtist.includes(part)))
    );
  });
}

export default async function ComingPage() {
  const collection = await getDiscogsCollection();

  // PUBLICADOS: todos os discos de albums.ts, com capas locais
  const publishedItems = albums.map((album) => ({
    id: parseInt(album.catalog, 10),
    releaseId: album.discogsId ?? 0,
    artist: album.artist,
    title: album.album,
    year: album.year,
    cover: album.cover,
    published: true,
  }));

  // POR VIR: itens da coleção Discogs ainda não cobertos em albums.ts
  const upcomingItems = collection
    .filter((item) => !isCovered(item))
    .map((item) => ({ ...item, published: false }));

  const items = [...publishedItems, ...upcomingItems];
  const publishedCount = publishedItems.length;
  const upcomingCount = upcomingItems.length;

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-4 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-6">
        <p className="text-sm tracking-[0.35em] text-purple-400">O ACERVO</p>

        <h1 className="text-5xl font-black mt-3 leading-none">
          O QUE VEM POR AÍ
        </h1>

        <p className="text-[#b8aa91] mt-5">
          Esta é a coleção completa. Alguns discos já têm história contada.
          Outros ainda estão esperando o momento certo.
        </p>

        <p className="mt-4 text-sm text-[#9d9079]">
          <span className="font-black text-brand-yellow">{items.length}</span>{" "}
          discos no acervo ·{" "}
          <span className="font-black text-brand-yellow">
            {publishedCount}
          </span>{" "}
          publicados ·{" "}
          <span className="font-black text-brand-yellow">
            {upcomingCount}
          </span>{" "}
          por vir
        </p>
      </section>

      {items.length === 0 ? (
        <p className="text-[#9d9079]">
          O acervo do Discogs está indisponível no momento.
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <FadeIn key={item.id} delay={Math.min(index * 30, 320)}>
              <div
                className={`cursor-pointer overflow-hidden rounded-xl border border-[#2b241c] bg-[#11100e] ${
                  item.published ? "" : "opacity-60"
                }`}
              >
                <div className="aspect-square w-full overflow-hidden">
                  {item.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cover}
                      alt={item.title}
                      className={`h-full w-full object-cover ${
                        item.published ? "" : "grayscale"
                      }`}
                    />
                  ) : (
                    <div className="h-full w-full bg-[#18130e]" />
                  )}
                </div>

                <div className="p-2">
                  {item.published && (
                    <span className="mb-1 inline-block rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-black tracking-wide text-black">
                      ✓ PUBLICADO
                    </span>
                  )}

                  <p className="text-xs font-black leading-tight">
                    {item.artist}
                  </p>

                  <p className="text-xs text-[#9d9079] leading-tight">
                    {item.title}
                  </p>

                  {item.year > 0 && (
                    <p className="mt-1 text-[10px] text-[#6f6555]">
                      {item.year}
                    </p>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </section>
      )}

      <div className="mt-10 mb-4 text-center">
        <a
          href="https://www.discogs.com/user/Luccas89/collection"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-brand-purple px-6 py-3 text-sm text-brand-purple transition hover:bg-brand-purple hover:text-white"
        >
          VER COLEÇÃO COMPLETA NO DISCOGS →
        </a>
      </div>

      <BottomNav />
    </main>
  );
}
