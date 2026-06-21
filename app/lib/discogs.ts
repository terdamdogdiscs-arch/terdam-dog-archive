import { cache } from "react";

const DISCOGS_USERNAME = "Luccas89";
const DISCOGS_API_BASE = "https://api.discogs.com";

export type DiscogsItem = {
  id: number;
  releaseId: number;
  artist: string;
  title: string;
  year: number;
  cover: string;
};

type DiscogsArtist = {
  name: string;
};

type DiscogsBasicInformation = {
  id: number;
  title: string;
  year: number;
  cover_image: string;
  artists?: DiscogsArtist[];
};

type DiscogsRelease = {
  id: number;
  basic_information: DiscogsBasicInformation;
};

type DiscogsCollectionResponse = {
  pagination?: { pages: number };
  releases?: DiscogsRelease[];
};

export type DiscogsTrack = {
  position: string;
  title: string;
  duration: string;
  durationSeconds: number;
};

type DiscogsTracklistEntry = {
  position: string;
  title: string;
  duration?: string;
  type_?: string;
};

type DiscogsImage = {
  type: string;
  uri: string;
};

type DiscogsReleaseDetail = {
  tracklist?: DiscogsTracklistEntry[];
  images?: DiscogsImage[];
};

function cleanArtistName(name: string): string {
  return name.replace(/\s\(\d+\)$/, "").trim();
}

// Converte "4:32" em segundos
function parseDuration(duration: string): number {
  if (!duration) return 0;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function discogsHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "User-Agent": "TerdamDogArchive/1.0",
  };

  if (process.env.DISCOGS_TOKEN) {
    headers.Authorization = `Discogs token=${process.env.DISCOGS_TOKEN}`;
  }

  return headers;
}

export const getDiscogsRelease = cache(
  async (releaseId: number): Promise<DiscogsReleaseDetail | null> => {
    try {
      const res = await fetch(`${DISCOGS_API_BASE}/releases/${releaseId}`, {
        headers: discogsHeaders(),
        next: { revalidate: 86400 },
      });

      if (!res.ok) return null;

      return (await res.json()) as DiscogsReleaseDetail;
    } catch {
      return null;
    }
  }
);

export const getReleaseCoverUrl = cache(
  async (releaseId: number): Promise<string | null> => {
    const release = await getDiscogsRelease(releaseId);
    const primary = release?.images?.find((img) => img.type === "primary");
    return primary?.uri ?? release?.images?.[0]?.uri ?? null;
  }
);

export const getReleaseTracks = cache(
  async (releaseId: number): Promise<DiscogsTrack[]> => {
    const release = await getDiscogsRelease(releaseId);

    if (!release?.tracklist) return [];

    return release.tracklist
      .filter((track) => !track.type_ || track.type_ === "track")
      .map((track) => ({
        position: track.position,
        title: track.title,
        duration: track.duration || "—",
        durationSeconds: parseDuration(track.duration ?? ""),
      }));
  }
);

// Formata segundos em "1h 23min" ou "45min"
export function formatTotalDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

export async function getDiscogsCollection(): Promise<DiscogsItem[]> {
  const items: DiscogsItem[] = [];
  const headers = discogsHeaders();

  let page = 1;
  let totalPages = 1;

  try {
    do {
      const res = await fetch(
        `${DISCOGS_API_BASE}/users/${DISCOGS_USERNAME}/collection/folders/0/releases?page=${page}&per_page=100&sort=artist`,
        {
          headers,
          next: { revalidate: 300 },
        }
      );

      if (!res.ok) break;

      const data: DiscogsCollectionResponse = await res.json();

      for (const release of data.releases ?? []) {
        const info = release.basic_information;

        items.push({
          id: release.id,
          releaseId: info.id ?? 0,
          artist:
            info.artists
              ?.map((artist) => cleanArtistName(artist.name))
              .join(", ") ?? "",
          title: info.title ?? "",
          year: info.year ?? 0,
          cover: info.cover_image ?? "",
        });
      }

      totalPages = data.pagination?.pages ?? 1;
      page += 1;
    } while (page <= totalPages);
  } catch {
    return items;
  }

  return items;
}
