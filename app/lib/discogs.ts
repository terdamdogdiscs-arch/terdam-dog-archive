const DISCOGS_USERNAME = "Luccas89";
const DISCOGS_API_BASE = "https://api.discogs.com";

export type DiscogsItem = {
  id: number;
  artist: string;
  title: string;
  year: number;
  cover: string;
};

type DiscogsArtist = {
  name: string;
};

type DiscogsBasicInformation = {
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

function cleanArtistName(name: string): string {
  return name.replace(/\s\(\d+\)$/, "").trim();
}

export async function getDiscogsCollection(): Promise<DiscogsItem[]> {
  const items: DiscogsItem[] = [];

  const headers: HeadersInit = {
    "User-Agent": "TerdamDogArchive/1.0",
  };

  if (process.env.DISCOGS_TOKEN) {
    headers.Authorization = `Discogs token=${process.env.DISCOGS_TOKEN}`;
  }

  let page = 1;
  let totalPages = 1;

  try {
    do {
      const res = await fetch(
        `${DISCOGS_API_BASE}/users/${DISCOGS_USERNAME}/collection/folders/0/releases?page=${page}&per_page=100&sort=artist`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      );

      if (!res.ok) break;

      const data: DiscogsCollectionResponse = await res.json();

      for (const release of data.releases ?? []) {
        const info = release.basic_information;

        items.push({
          id: release.id,
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
