import type { Album } from "../data/albums";

export function getTotalValue(albums: Album[]): number {
  return albums.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);
}
