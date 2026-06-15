/**
 * Busca a duração das faixas de cada disco com `discogsId` na API do Discogs
 * e imprime o `totalDurationSeconds` correspondente para atualizar
 * app/data/albums.ts manualmente.
 *
 * Uso:
 *   DISCOGS_TOKEN=xxxx npx tsx app/scripts/syncDurations.ts
 *
 * (lê também o token de .env.local, se DISCOGS_TOKEN não estiver no ambiente)
 */

import { readFileSync, existsSync } from "fs";
import { albums } from "../data/albums";

function loadEnvToken(): string | undefined {
  if (process.env.DISCOGS_TOKEN) return process.env.DISCOGS_TOKEN;

  const envPath = ".env.local";
  if (!existsSync(envPath)) return undefined;

  const match = readFileSync(envPath, "utf8").match(/^DISCOGS_TOKEN=(.*)$/m);
  return match?.[1]?.trim();
}

function parseDuration(duration: string): number {
  if (!duration) return 0;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

type DiscogsTracklistEntry = {
  duration?: string;
  type_?: string;
};

type DiscogsReleaseDetail = {
  tracklist?: DiscogsTracklistEntry[];
};

async function main() {
  const token = loadEnvToken();

  if (!token) {
    console.error("DISCOGS_TOKEN não encontrado (env ou .env.local).");
    process.exit(1);
  }

  const headers = {
    "User-Agent": "TerdamDogArchive/1.0",
    Authorization: `Discogs token=${token}`,
  };

  for (const album of albums) {
    if (!album.discogsId) {
      console.log(`${album.catalog} — sem discogsId, ignorado`);
      continue;
    }

    const res = await fetch(
      `https://api.discogs.com/releases/${album.discogsId}`,
      { headers }
    );

    if (!res.ok) {
      console.log(`${album.catalog} — erro ao buscar release ${album.discogsId}`);
      continue;
    }

    const data: DiscogsReleaseDetail = await res.json();

    const totalDurationSeconds = (data.tracklist ?? [])
      .filter((track) => !track.type_ || track.type_ === "track")
      .reduce((sum, track) => sum + parseDuration(track.duration ?? ""), 0);

    console.log(
      `${album.catalog} (${album.artist} - ${album.album}): totalDurationSeconds: ${totalDurationSeconds}`
    );

    // Respeita o rate limit da API do Discogs (60 req/min autenticado).
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }
}

main();
