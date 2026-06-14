export type GenreAccent = {
  bg: string;
  border: string;
  text: string;
};

const RED: GenreAccent = {
  bg: "bg-brand-red",
  border: "border-brand-red",
  text: "text-brand-red",
};

const YELLOW: GenreAccent = {
  bg: "bg-brand-yellow",
  border: "border-brand-yellow",
  text: "text-brand-yellow",
};

const PURPLE: GenreAccent = {
  bg: "bg-brand-purple",
  border: "border-brand-purple",
  text: "text-brand-purple",
};

const GREEN: GenreAccent = {
  bg: "bg-brand-green",
  border: "border-brand-green",
  text: "text-brand-green",
};

export function genreColor(genre: string): GenreAccent {
  if (genre.includes("Reggae")) return RED;
  if (genre.includes("Jazz")) return PURPLE;
  if (genre.includes("Hip-Hop")) return YELLOW;
  return GREEN;
}

export const dnaAccents = {
  reggae: RED,
  hiphop: YELLOW,
  jazz: PURPLE,
  brasil: GREEN,
};
