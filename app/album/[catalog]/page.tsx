import Link from "next/link";

import { albums } from "../../data/albums";
import { tracks } from "../../data/tracks";
import { dna } from "../../data/dna";
import { connections } from "../../data/connections";
import { notes } from "../../data/notes";
import { acquisitions } from "../../data/acquisitions";
import BottomNav from "../../components/BottomNav";
import CoverImage from "./CoverImage";
import { genreColor, dnaAccents, GenreAccent } from "../../lib/genreColor";
import { getReleaseTracks, formatTotalDuration } from "../../lib/discogs";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ catalog: string }>;
}) {
  const { catalog } = await params;

  const album = albums.find((item) => item.catalog === catalog);

  if (!album) {
    return (
      <main className="min-h-screen bg-brand-black text-[#f4ead8] p-6">
        <Link href="/" className="text-purple-400">
          ← Coleção
        </Link>

        <h1 className="text-3xl font-bold mt-8">
          Disco não encontrado
        </h1>
      </main>
    );
  }

  const albumTracks = tracks.filter((track) => track.catalog === catalog);
  const currentIndex = albums.findIndex((item) => item.catalog === catalog);
  const previousAlbum = albums[currentIndex - 1];
  const nextAlbum = albums[currentIndex + 1];

  const albumDna = dna[catalog as keyof typeof dna];
  const acquisition = acquisitions[catalog as keyof typeof acquisitions];

  const curatedConnections = connections
    .filter((item) => item.source === catalog || item.target === catalog)
    .map((item) => {
      const otherCatalog = item.source === catalog ? item.target : item.source;
      const otherAlbum = albums.find((entry) => entry.catalog === otherCatalog);
      return otherAlbum ? { ...otherAlbum, reason: item.reason } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const relatedAlbums = albums
    .filter(
      (item) =>
        item.genre === album.genre &&
        item.catalog !== album.catalog &&
        !curatedConnections.some((connection) => connection.catalog === item.catalog)
    )
    .slice(0, Math.max(0, 3 - curatedConnections.length));

  const currentNote = notes[catalog as keyof typeof notes];
  const nextNote = nextAlbum
    ? notes[nextAlbum.catalog as keyof typeof notes]
    : undefined;

  const incomingConnection = previousAlbum
    ? connections.find(
        (item) => item.source === previousAlbum.catalog && item.target === catalog
      )
    : undefined;

  const outgoingConnection = nextAlbum
    ? connections.find(
        (item) => item.source === catalog && item.target === nextAlbum.catalog
      )
    : undefined;

  const cameFromTitle =
    incomingConnection?.reason ?? currentNote?.story ?? "Conexão narrativa";
  const cameFromText = currentNote?.note ?? "";

  const leadsToTitle =
    outgoingConnection?.reason ?? nextNote?.story ?? "Conexão narrativa";
  const leadsToText = nextNote?.note ?? "";

  const groupedTracks = albumTracks.reduce<Record<string, typeof albumTracks>>(
    (acc, track) => {
      acc[track.side] = acc[track.side] || [];
      acc[track.side].push(track);
      return acc;
    },
    {}
  );

  const discogsTracks = album.discogsId
    ? await getReleaseTracks(album.discogsId)
    : [];

  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-5 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 rounded-[2rem] border border-purple-800 bg-[#11100e] overflow-hidden">
        <div className="aspect-square min-h-[280px] bg-brand-black">
          <CoverImage album={album} />
        </div>

        <div className="p-6">
          <p className="text-sm tracking-[0.35em] text-purple-400">
            DISCO TD-{album.catalog}
          </p>

          <h1 className="text-5xl font-black mt-4 leading-none">
            {album.artist}
          </h1>

          <h2 className="text-2xl text-[#b8aa91] mt-4">
            {album.album}
          </h2>

          <section className="mt-8 rounded-3xl border border-yellow-700 bg-yellow-950/20 p-5">
            <p className="text-xs tracking-[0.3em] text-yellow-400">
              FICHA DO COLECIONADOR
            </p>

            <h3 className="text-4xl font-black mt-3 text-brand-yellow">
              TD-{album.catalog}
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <Info label="Ano" value={album.year} />
              <Info label="País" value={album.country} />
              <Info label="Gênero" value={album.genre} />
              <Info
                label="Valor est."
                value={`R$ ${album.estimatedValue || 0}`}
              />
              <Info label="Selo" value={album.label} />
              <Info label="Pressing" value={album.pressing} />
            </div>

            {albumDna && (
              <div className="mt-6 space-y-4">
                <DnaBar label="Reggae" value={albumDna.reggae} accent={dnaAccents.reggae} />
                <DnaBar label="Hip-Hop" value={albumDna.hiphop} accent={dnaAccents.hiphop} />
                <DnaBar label="Jazz" value={albumDna.jazz} accent={dnaAccents.jazz} />
                <DnaBar label="Brasil" value={albumDna.brasil} accent={dnaAccents.brasil} />
              </div>
            )}

            {acquisition && (
              <div className="mt-6">
                <p className="text-xs tracking-[0.3em] text-yellow-400">
                  AQUISIÇÃO
                </p>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <Info label="Pago em" value={`R$ ${acquisition.pricePaid}`} />
                  <Info label="Estado" value={acquisition.condition} />
                  <Info label="Origem" value={acquisition.source} />
                  {album.estimatedValue && (
                    <Info
                      label="Ganho potencial"
                      value={`R$ ${album.estimatedValue - acquisition.pricePaid}`}
                    />
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="mt-8 rounded-3xl border border-[#2b241c] p-5">
            <p className="text-sm text-[#9d9079]">
              Papel na coleção
            </p>

            <p className="text-4xl font-black mt-2">
              {album.role}
            </p>

            <p className="text-[#b8aa91] mt-2">
              {album.subgenre}
            </p>
          </section>

          <section className="mt-8 rounded-3xl border border-purple-800 bg-purple-950/20 p-6">
            <p className="text-xs tracking-[0.3em] text-purple-400">
              NOTAS TERDAM DOG
            </p>

            <h3 className="text-3xl font-black mt-4">
              Registro narrativo
            </h3>

            <p className="text-[#b8aa91] mt-4 leading-relaxed text-lg">
              {album.note}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm tracking-wider ${genreColor(album.genre).border}`}>
                {album.genre}
              </span>

              <span className="rounded-full border border-yellow-600 px-3 py-1 text-sm">
                {album.subgenre}
              </span>

              <span className="rounded-full border border-green-600 px-3 py-1 text-sm">
                TD-{album.catalog}
              </span>
            </div>
          </section>

          {(previousAlbum || nextAlbum) && (
            <section className="mt-8 space-y-4">
              {previousAlbum && (
                <div className="rounded-3xl border-[1.5px] border-brand-purple bg-purple-950/10 p-5">
                  <p className="text-xs tracking-[0.3em] text-brand-purple">
                    VEIO DE
                  </p>

                  <p className="text-xl font-bold mt-2">
                    {cameFromTitle}
                  </p>

                  <p className="text-[#b8aa91] mt-2 text-sm leading-relaxed">
                    {cameFromText}
                  </p>

                  <div className="flex items-center gap-3 mt-5">
                    <Link
                      href={`/album/${previousAlbum.catalog}`}
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#2b241c]"
                    >
                      <CoverImage album={previousAlbum} />
                    </Link>

                    <span className="text-2xl text-brand-purple">→</span>

                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-brand-purple">
                      <CoverImage album={album} />
                    </div>
                  </div>
                </div>
              )}

              {nextAlbum && (
                <div className="rounded-3xl border-[1.5px] border-brand-purple bg-purple-950/10 p-5">
                  <p className="text-xs tracking-[0.3em] text-brand-purple">
                    POR QUE ESTE DISCO LEVA AO PRÓXIMO
                  </p>

                  <p className="text-xl font-bold mt-2">
                    {leadsToTitle}
                  </p>

                  <p className="text-[#b8aa91] mt-2 text-sm leading-relaxed">
                    {leadsToText}
                  </p>

                  <div className="flex items-center gap-3 mt-5">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-brand-purple">
                      <CoverImage album={album} />
                    </div>

                    <span className="text-2xl text-brand-purple">→</span>

                    <Link
                      href={`/album/${nextAlbum.catalog}`}
                      className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#2b241c]"
                    >
                      <CoverImage album={nextAlbum} />
                    </Link>
                  </div>
                </div>
              )}
            </section>
          )}

          {(curatedConnections.length > 0 || relatedAlbums.length > 0) && (
            <section className="mt-8 rounded-3xl border border-[#2b241c] p-5">
              <h3 className="text-2xl font-black mb-4">
                Conexões
              </h3>

              <div className="space-y-3">
                {curatedConnections.map((item) => (
                  <Link
                    key={item.catalog}
                    href={`/album/${item.catalog}`}
                    className="block rounded-2xl border border-[#2b241c] p-4 hover:border-purple-500"
                  >
                    <p className="text-purple-400">
                      TD-{item.catalog}
                    </p>

                    <p className="font-black">
                      {item.artist}
                    </p>

                    <p className="text-sm text-[#9d9079]">
                      {item.album}
                    </p>

                    <p className="text-xs tracking-[0.2em] text-yellow-400 mt-2">
                      ↳ {item.reason}
                    </p>
                  </Link>
                ))}

                {relatedAlbums.map((item) => (
                  <Link
                    key={item.catalog}
                    href={`/album/${item.catalog}`}
                    className="block rounded-2xl border border-[#2b241c] p-4 hover:border-purple-500"
                  >
                    <p className="text-purple-400">
                      TD-{item.catalog}
                    </p>

                    <p className="font-black">
                      {item.artist}
                    </p>

                    <p className="text-sm text-[#9d9079]">
                      {item.album}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {albumTracks.length > 0 && (
            <section className="mt-8">
              <h3 className="text-3xl font-black mb-4">
                Tracklist
              </h3>

              <div className="space-y-6">
                {Object.entries(groupedTracks).map(([side, sideTracks]) => (
                  <div
                    key={side}
                    className="rounded-3xl border border-[#2b241c] p-5"
                  >
                    <h4 className="text-purple-400 font-black mb-4">
                      SIDE {side}
                    </h4>

                    <div className="space-y-3">
                      {sideTracks.map((track) => {
                        const discogsTrack = discogsTracks[track.number - 1];

                        const displayDuration =
                          discogsTrack && discogsTrack.duration !== "—"
                            ? discogsTrack.duration
                            : track.duration;

                        return (
                          <div
                            key={`${track.catalog}-${track.number}`}
                            className="flex gap-3 border-b border-[#241f18] pb-2"
                          >
                            <span className="text-purple-400 w-8">
                              {track.number}
                            </span>

                            <span>{track.title}</span>

                            {!!displayDuration && (
                              <span className="ml-auto text-sm text-[#9d9079]">
                                {displayDuration}
                              </span>
                            )}

                            {track.bpm && (
                              <span className="text-sm text-[#9d9079]">
                                {track.bpm} BPM
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!!album.totalDurationSeconds && (
                <p className="mt-5 text-sm tracking-[0.2em] text-[#9d9079]">
                  DURAÇÃO TOTAL ·{" "}
                  <span className="font-bold text-brand-yellow">
                    {formatTotalDuration(album.totalDurationSeconds)}
                  </span>
                </p>
              )}
            </section>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 mt-6">
        {previousAlbum && (
          <Link
            href={`/album/${previousAlbum.catalog}`}
            className="rounded-3xl border border-[#2b241c] p-4 hover:border-purple-500"
          >
            <p className="text-[#9d9079] text-sm">
              Anterior
            </p>

            <p>#{previousAlbum.catalog}</p>

            <p className="font-black">
              {previousAlbum.artist}
            </p>
          </Link>
        )}

        {nextAlbum && (
          <Link
            href={`/album/${nextAlbum.catalog}`}
            className="rounded-3xl border border-[#2b241c] p-4 hover:border-purple-500"
          >
            <p className="text-[#9d9079] text-sm">
              Próximo
            </p>

            <p>#{nextAlbum.catalog}</p>

            <p className="font-black">
              {nextAlbum.artist}
            </p>
          </Link>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-[#2b241c] p-4">
      <p className="text-sm text-[#9d9079]">
        {label}
      </p>

      <p className="text-xl font-black">
        {value}
      </p>
    </div>
  );
}

function DnaBar({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: GenreAccent;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>

        <span className={`${accent.text} font-black`}>
          {value}%
        </span>
      </div>

      <div className="h-3 bg-brand-black rounded-full overflow-hidden">
        <div
          className={`h-3 ${accent.bg} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}