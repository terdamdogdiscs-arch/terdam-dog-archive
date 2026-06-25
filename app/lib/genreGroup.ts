import type { Album } from "../data/albums";

export const primaryGenreLabels = [
  "Reggae",
  "Hip-Hop",
  "Jazz",
  "MPB/Samba",
  "Outros",
] as const;

export type PrimaryGenre = (typeof primaryGenreLabels)[number];

export function getPrimaryGenre(
  album: Pick<Album, "genre" | "subgenre" | "country">
): PrimaryGenre {
  // Classifica pelo campo `genre` (curado), não pelo subgênero — evita que
  // o subgênero "puxe" o disco para a categoria errada (ex: Fugees tem
  // "…/ Reggae" no subgênero, mas é Hip-Hop; Sergio Mendes tem "Brazilian
  // Jazz" no subgênero, mas é MPB).
  const genre = album.genre.toLowerCase();

  if (genre.includes("reggae") || genre.includes("ska") || genre.includes("rocksteady")) {
    return "Reggae";
  }

  // Jazz antes de Hip-Hop para "Jazz Rap" cair em Jazz (e não no "rap").
  if (genre.includes("jazz") || genre.includes("bop")) {
    return "Jazz";
  }

  if (genre.includes("hip-hop") || genre.includes("hip hop")) {
    return "Hip-Hop";
  }

  if (
    genre.includes("mpb") ||
    genre.includes("samba") ||
    genre.includes("pagode") ||
    genre.includes("bossa")
  ) {
    return "MPB/Samba";
  }

  return "Outros";
}

export function countPrimaryGenres<T extends Pick<Album, "genre" | "subgenre" | "country">>(
  items: T[]
): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, album) => {
    const group = getPrimaryGenre(album);
    counts[group] = (counts[group] || 0) + 1;
    return counts;
  }, {});
}
