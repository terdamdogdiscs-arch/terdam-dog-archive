import type { Album } from "../data/albums";

export function generateJourneyPhrase(albums: Album[]): string {
  const seen = new Set<string>();
  const words: string[] = [];

  for (const album of albums) {
    if (album.narrativeCountry && !seen.has(album.narrativeCountry)) {
      seen.add(album.narrativeCountry);
      words.push(album.narrativeCountry);
    }
  }

  if (words.length === 0) return "Uma coleção viva.";
  if (words.length === 1) return `${words[0]} em uma coleção viva.`;

  const last = words.pop();
  return `${words.join(", ")} e ${last} em uma coleção viva.`;
}
