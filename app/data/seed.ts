import { albums } from "./albums";
import { tracks } from "./tracks";
import { notes } from "./notes";
import { dna } from "./dna";
import { acquisitions } from "./acquisitions";

type Note = {
  note: string;
  story: string;
  previous?: string;
  next?: string;
};

export const collectionSeed = albums.map((album) => {
  const catalog = album.catalog;

  const albumTracks = tracks.filter((track) => track.catalog === catalog);

  const note = notes[catalog as keyof typeof notes] as Note | undefined;
  const albumDna = dna[catalog as keyof typeof dna];
  const acquisition = acquisitions[catalog as keyof typeof acquisitions];

  return {
    ...album,

    tracks: albumTracks,

    trackCount: albumTracks.length,

    note: note?.note || album.note || "",
    story: note?.story || album.role,
    previous: note?.previous || null,
    next: note?.next || null,

    dna: albumDna || {
      reggae: 0,
      hiphop: 0,
      jazz: 0,
      brasil: 0,
    },

    acquisition: acquisition || {
      pricePaid: null,
      condition: "Não informado",
      source: "Não informado",
    },

    financial: {
      estimatedValue: album.estimatedValue || 0,
      pricePaid: acquisition?.pricePaid || null,
      potentialGain:
        acquisition?.pricePaid && album.estimatedValue
          ? album.estimatedValue - acquisition.pricePaid
          : null,
    },
  };
});

export const collectionStats = {
  totalAlbums: collectionSeed.length,

  totalTracks: collectionSeed.reduce(
    (sum, album) => sum + album.trackCount,
    0
  ),

  totalEstimatedValue: collectionSeed.reduce(
    (sum, album) => sum + album.financial.estimatedValue,
    0
  ),

  totalPaid: collectionSeed.reduce((sum, album) => {
    return sum + (album.financial.pricePaid || 0);
  }, 0),

  countries: [...new Set(collectionSeed.map((album) => album.country))],

  genres: [...new Set(collectionSeed.map((album) => album.genre))],

  decades: [
    ...new Set(
      collectionSeed.map((album) => Math.floor(album.year / 10) * 10)
    ),
  ],
};

export const collectionScore = Math.min(
  100,
  collectionStats.countries.length * 8 +
    collectionStats.genres.length * 12 +
    collectionStats.decades.length * 10
);