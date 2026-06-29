import type { Album } from "../data/albums";

export type Mood = "melancólico" | "festivo" | "político" | "espiritual" | "sensual";
export type Energy = "calmo" | "dançante" | "intenso";
export type Territory = "brasil" | "jamaica" | "nova-york" | "diaspora-africana";

export type DiscoveryFilters = {
  moods: Mood[];
  energies: Energy[];
  territories: Territory[];
};

export type ScoredResult = {
  catalog: string;
  score: number;
  maxScore: number;
  isPartial: boolean;
};

// Keywords checked against tese + contexto + ponte + album.note (lowercased)
const MOOD_KEYWORDS: Record<Mood, string[]> = {
  "melancólico": [
    "silêncio", "memória", "reconhecimento", "distante", "perda",
    "saudade", "luto", "dor", "esquecimento", "melancolia", "ausência",
  ],
  "festivo": [
    "festa", "dançar", "dançantes", "roda", "celebrar", "solar",
    "groove", "grooves", "alegria", "carnaval", "generoso",
  ],
  "político": [
    "crítica social", "consciência", "emancipação", "apartheid",
    "política", "transformação social", "resistência", "injustiça",
    "denúncia", "colonialismo", "luta", "nazism",
  ],
  "espiritual": [
    "espiritualidade", "rastafári", "orixás", "ancestralidade",
    "alquimia", "espiritual", "matriz africana", "religiosidade",
    "sagrado", "fé", "rastafari",
  ],
  "sensual": [
    "romântico", "romance", "íntima", "intimidade", "corpo",
    "sedução", "lovers",
  ],
};

function deriveEnergies(genre: string, subgenre: string): Energy[] {
  const g = `${genre} ${subgenre}`.toLowerCase();
  const energies = new Set<Energy>();

  // CALMO: introspective, gentle, intimate
  if (
    /bossa nova|canção brasileira|piano jazz|samba de breque/.test(g) ||
    (/\bjazz\b/.test(g) && !/big band|jazz rap|hip.hop/.test(g)) ||
    (/\bmpb\b/.test(g) && !/samba funk|samba rock/.test(g)) ||
    (/\bsamba\b/.test(g) && !/funk|rock|pagode/.test(g))
  ) {
    energies.add("calmo");
  }

  // DANÇANTE: rhythmic, groovy, party
  if (
    /pagode|samba funk|samba rock|dancehall|\bfunk\b|lovers rock|pop.reggae|reggae.*pop|world music/.test(g)
  ) {
    energies.add("dançante");
  }

  // INTENSO: raw, energetic, political force
  if (
    /hip.hop|golden age|alternative hip.hop|jazz rap|big band|ska|rocksteady|roots reggae|african reggae/.test(g) ||
    (/\breggae\b/.test(g) && !/pop.reggae|reggae.*pop|lovers rock/.test(g))
  ) {
    energies.add("intenso");
  }

  return energies.size > 0 ? [...energies] : ["calmo"];
}

function deriveTerritories(country: string, narrativeCountry?: string | null): Territory[] {
  const c = `${country} ${narrativeCountry ?? ""}`.toLowerCase();
  const territories = new Set<Territory>();

  if (/brasil|bahia/.test(c)) territories.add("brasil");
  if (/jamaica/.test(c)) territories.add("jamaica");
  if (/eua|nova york|canadá|canada/.test(c)) territories.add("nova-york");
  if (/áfrica|africa|marfim|nigeria|nigéria|ghana|cabo verde|angola|bahia/.test(c)) {
    territories.add("diaspora-africana");
  }

  return [...territories];
}

export function scoreAlbums(
  albums: Album[],
  captionMap: Record<string, { tese: string; contexto: string; ponte: string }>,
  filters: DiscoveryFilters
): ScoredResult[] {
  const totalCriteria =
    filters.moods.length + filters.energies.length + filters.territories.length;
  if (totalCriteria === 0) return [];

  const results = albums
    .map((album) => {
      const caption = captionMap[album.catalog];
      const text =
        `${caption?.tese ?? ""} ${caption?.contexto ?? ""} ${caption?.ponte ?? ""} ${album.note}`.toLowerCase();

      const matchedMoods = filters.moods.filter((mood) =>
        MOOD_KEYWORDS[mood].some((kw) => text.includes(kw))
      ).length;

      const albumEnergies = deriveEnergies(album.genre, album.subgenre);
      const matchedEnergies = filters.energies.filter((e) =>
        albumEnergies.includes(e)
      ).length;

      const albumTerritories = deriveTerritories(album.country, album.narrativeCountry);
      const matchedTerritories = filters.territories.filter((t) =>
        albumTerritories.includes(t)
      ).length;

      const score = matchedMoods + matchedEnergies + matchedTerritories;
      return { catalog: album.catalog, score, maxScore: totalCriteria, isPartial: false };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (results.length === 0) return [];

  const topScore = results[0].score;
  // Full match = reaches top score AND satisfies all criteria (score === totalCriteria)
  const hasFullMatch = topScore === totalCriteria;

  return results
    .slice(0, 6)
    .map((r) => ({ ...r, isPartial: hasFullMatch ? r.score < totalCriteria : true }));
}

// Expose energy/territory derivation for display
export { deriveEnergies, deriveTerritories };
