import type { Album } from "../data/albums";
import { connections, type Connection } from "../data/connections";

export type Mood = "melancólico" | "festivo" | "político" | "espiritual" | "sensual";
export type Energy = "calmo" | "dançante" | "intenso";
export type Territory = "brasil" | "jamaica" | "nova-york" | "diaspora-africana";
export type NarrativeRole = Album["role"];

export type DiscoveryFilters = {
  moods: Mood[];
  energies: Energy[];
  territories: Territory[];
  roles?: NarrativeRole[];
};

export type RelatedConnection = {
  direction: "incoming" | "outgoing";
  relatedCatalog: string | null;
  reason: string;
  description?: string;
  type?: Connection["type"];
};

export type ScoredResult = {
  catalog: string;
  score: number;
  maxScore: number;
  isPartial: boolean;
  role: NarrativeRole;
  roleScore: number;
  connectionCount: number;
  connectionScore: number;
  contextScore: number;
  genreScore: number;
  countryScore: number;
  matchedMoods: Mood[];
  matchedEnergies: Energy[];
  matchedTerritories: Territory[];
  matchedRoles: NarrativeRole[];
  connections: RelatedConnection[];
  primaryConnection?: RelatedConnection;
  whyAppeared: {
    source: "connection" | "caption" | "role";
    text: string;
  };
};

export type DiscoverySearchResult = {
  results: ScoredResult[];
  totalFound: number;
  totalExact: number;
};

type CaptionData = {
  tese: string;
  contexto: string;
  ponte: string;
};

// ── Mood keywords ─────────────────────────────────────────────────────────────
// Checked against tese + contexto + ponte + album.note.

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

function normalizeText(text: string): string {
  return text.normalize("NFC").toLocaleLowerCase("pt-BR");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWholeTerm(text: string, term: string): boolean {
  const expression = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(normalizeText(term))}($|[^\\p{L}\\p{N}])`,
    "u"
  );
  return expression.test(text);
}

// ── Energy derivation ─────────────────────────────────────────────────────────

export function deriveEnergies(genre: string, subgenre: string): Energy[] {
  const g = `${genre} ${subgenre}`.toLowerCase();
  const energies = new Set<Energy>();

  if (
    /bossa nova|canção brasileira|piano jazz|samba de breque/.test(g) ||
    (/\bjazz\b/.test(g) && !/big band|jazz rap|hip.hop/.test(g)) ||
    (/\bmpb\b/.test(g) && !/samba funk|samba rock/.test(g)) ||
    (/\bsamba\b/.test(g) && !/funk|rock|pagode/.test(g))
  ) {
    energies.add("calmo");
  }

  if (/pagode|samba funk|samba rock|dancehall|\bfunk\b|lovers rock|pop.reggae|reggae.*pop|world music/.test(g)) {
    energies.add("dançante");
  }

  if (
    /hip.hop|golden age|alternative hip.hop|jazz rap|big band|ska|rocksteady|roots reggae|african reggae/.test(g) ||
    (/\breggae\b/.test(g) && !/pop.reggae|reggae.*pop|lovers rock/.test(g))
  ) {
    energies.add("intenso");
  }

  return energies.size > 0 ? [...energies] : ["calmo"];
}

// ── Territory derivation ──────────────────────────────────────────────────────

export function deriveTerritories(country: string, narrativeCountry?: string | null): Territory[] {
  const c = `${country} ${narrativeCountry ?? ""}`.toLowerCase();
  const territories = new Set<Territory>();

  if (/brasil|bahia/.test(c)) territories.add("brasil");
  if (/jamaica/.test(c)) territories.add("jamaica");
  if (/eua|nova york|canadá|canada/.test(c)) territories.add("nova-york");
  if (/áfrica|africa|marfim|nigeria|nigéria|ghana|cabo verde|angola/.test(c)) {
    territories.add("diaspora-africana");
  }

  return [...territories];
}

// ── Narrative relevance ───────────────────────────────────────────────────────

const ROLE_IMPORTANCE: Record<string, number> = {
  "Origem": 5,
  "Referência": 5,
  "Referência Cruzada": 5,
  "Virada": 4,
  "Ponte": 4,
  "Conexão": 4,
  "Família Marley": 4,
  "Contexto": 4,
  "Novo Capítulo": 3,
  "Novo Bloco": 3,
  "Retorno": 3,
  "Encerramento": 3,
  "Retrospectiva": 3,
  "Consolidação": 2,
  "Continuidade": 2,
  "Expansão": 2,
  "Aprofundamento": 2,
  "Profundidade": 2,
  "Intensidade": 1,
  "Intimidade": 1,
  "Leveza": 1,
};

function getRoleScore(role: NarrativeRole): number {
  return ROLE_IMPORTANCE[role] ?? 0;
}

function buildConnectionIndex(): Map<string, RelatedConnection[]> {
  const index = new Map<string, RelatedConnection[]>();

  function add(catalog: string, connection: RelatedConnection) {
    const current = index.get(catalog) ?? [];
    current.push(connection);
    index.set(catalog, current);
  }

  for (const connection of connections) {
    add(connection.source, {
      direction: "outgoing",
      relatedCatalog: connection.target,
      reason: connection.reason,
      description: connection.description,
      type: connection.type,
    });

    if (connection.target) {
      add(connection.target, {
        direction: "incoming",
        relatedCatalog: connection.source,
        reason: connection.reason,
        description: connection.description,
        type: connection.type,
      });
    }
  }

  return index;
}

function choosePrimaryConnection(
  albumConnections: RelatedConnection[]
): RelatedConnection | undefined {
  return [...albumConnections].sort((a, b) => {
    const descriptionDifference = Number(Boolean(b.description)) - Number(Boolean(a.description));
    if (descriptionDifference !== 0) return descriptionDifference;

    const typeDifference = Number(Boolean(b.type)) - Number(Boolean(a.type));
    if (typeDifference !== 0) return typeDifference;

    return Number(Boolean(b.relatedCatalog)) - Number(Boolean(a.relatedCatalog));
  })[0];
}

function getContextScore(caption: CaptionData | undefined, matchedMoods: Mood[]): number {
  const populatedFields = caption
    ? [caption.ponte, caption.contexto, caption.tese].filter((field) => field.trim()).length
    : 0;

  return matchedMoods.length * 10 + populatedFields;
}

function getWhyAppeared(
  album: Album,
  caption: CaptionData | undefined,
  primaryConnection: RelatedConnection | undefined
): ScoredResult["whyAppeared"] {
  if (primaryConnection) {
    return {
      source: "connection",
      text: primaryConnection.description?.trim() || primaryConnection.reason,
    };
  }

  const captionText =
    caption?.ponte.trim() || caption?.contexto.trim() || caption?.tese.trim();

  if (captionText) {
    return { source: "caption", text: captionText };
  }

  return { source: "role", text: album.role };
}

// ── Main scoring function ─────────────────────────────────────────────────────

export function scoreAlbums(
  albums: Album[],
  captionMap: Record<string, CaptionData>,
  filters: DiscoveryFilters
): DiscoverySearchResult {
  const selectedRoles = filters.roles ?? [];
  const totalCriteria =
    filters.moods.length +
    filters.energies.length +
    filters.territories.length +
    selectedRoles.length;

  if (totalCriteria === 0) {
    return { results: [], totalFound: 0, totalExact: 0 };
  }

  const connectionIndex = buildConnectionIndex();
  const catalogOrder = new Map(albums.map((album, index) => [album.catalog, index]));

  const rankedResults = albums
    .map((album): ScoredResult => {
      const caption = captionMap[album.catalog];
      const text = normalizeText(
        `${caption?.tese ?? ""} ${caption?.contexto ?? ""} ${caption?.ponte ?? ""} ${album.note}`
      );

      const matchedMoods = filters.moods.filter((mood) =>
        MOOD_KEYWORDS[mood].some((keyword) => containsWholeTerm(text, keyword))
      );
      const albumEnergies = deriveEnergies(album.genre, album.subgenre);
      const matchedEnergies = filters.energies.filter((energy) =>
        albumEnergies.includes(energy)
      );
      const albumTerritories = deriveTerritories(album.country, album.narrativeCountry);
      const matchedTerritories = filters.territories.filter((territory) =>
        albumTerritories.includes(territory)
      );
      const matchedRoles = selectedRoles.filter((role) => role === album.role);

      const albumConnections = connectionIndex.get(album.catalog) ?? [];
      const primaryConnection = choosePrimaryConnection(albumConnections);
      const describedConnections = albumConnections.filter(
        (connection) => connection.description
      ).length;
      const typedConnections = albumConnections.filter(
        (connection) => connection.type
      ).length;

      const score =
        matchedMoods.length +
        matchedEnergies.length +
        matchedTerritories.length +
        matchedRoles.length;
      const connectionScore =
        albumConnections.length * 100 + describedConnections * 10 + typedConnections;

      return {
        catalog: album.catalog,
        score,
        maxScore: totalCriteria,
        isPartial: score < totalCriteria,
        role: album.role,
        roleScore: getRoleScore(album.role),
        connectionCount: albumConnections.length,
        connectionScore,
        contextScore: getContextScore(caption, matchedMoods),
        genreScore: matchedEnergies.length,
        countryScore: matchedTerritories.length,
        matchedMoods,
        matchedEnergies,
        matchedTerritories,
        matchedRoles,
        connections: albumConnections,
        primaryConnection,
        whyAppeared: getWhyAppeared(album, caption, primaryConnection),
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      const scoreDifference = b.score - a.score;
      if (scoreDifference !== 0) return scoreDifference;

      const connectionDifference = b.connectionScore - a.connectionScore;
      if (connectionDifference !== 0) return connectionDifference;

      const roleDifference = b.roleScore - a.roleScore;
      if (roleDifference !== 0) return roleDifference;

      const contextDifference = b.contextScore - a.contextScore;
      if (contextDifference !== 0) return contextDifference;

      const genreDifference = b.genreScore - a.genreScore;
      if (genreDifference !== 0) return genreDifference;

      const countryDifference = b.countryScore - a.countryScore;
      if (countryDifference !== 0) return countryDifference;

      return (catalogOrder.get(a.catalog) ?? 0) - (catalogOrder.get(b.catalog) ?? 0);
    });

  return {
    results: rankedResults.slice(0, 6),
    totalFound: rankedResults.length,
    totalExact: rankedResults.filter((result) => !result.isPartial).length,
  };
}
