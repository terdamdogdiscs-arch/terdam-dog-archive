"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { albums } from "../data/albums";
import { captions } from "../data/captions";
import {
  scoreAlbums,
  type DiscoveryFilters,
  type DiscoverySearchResult,
  type Energy,
  type Mood,
  type ScoredResult,
  type Territory,
} from "../lib/discoveryEngine";

// ── Label maps ────────────────────────────────────────────────────────────────

const MOOD_LABELS: Record<Mood, string> = {
  "melancólico": "Melancólico",
  "festivo":     "Festivo",
  "político":    "Político",
  "espiritual":  "Espiritual",
  "sensual":     "Sensual",
};

const ENERGY_LABELS: Record<Energy, string> = {
  "calmo":    "Calmo",
  "dançante": "Dançante",
  "intenso":  "Intenso",
};

const TERRITORY_LABELS: Record<Territory, string> = {
  "brasil":          "Brasil",
  "jamaica":         "Jamaica",
  "nova-york":       "Nova York",
  "atlantico-negro": "Atlântico Negro",
};

const ALL_MOODS      = Object.keys(MOOD_LABELS) as Mood[];
const ALL_ENERGIES   = Object.keys(ENERGY_LABELS) as Energy[];
const ALL_TERRITORIES = Object.keys(TERRITORY_LABELS) as Territory[];

// ── Caption shim ──────────────────────────────────────────────────────────────
type CaptionSlim = { tese: string; contexto: string; ponte: string; hashtags: string };
const captionMap: Record<string, CaptionSlim> = Object.fromEntries(
  Object.entries(captions).map(([k, v]) => [
    k,
    { tese: v.tese, contexto: v.contexto, ponte: v.ponte, hashtags: v.hashtags },
  ])
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function readParamValues<T extends string>(
  params: URLSearchParams,
  key: string,
  allowedValues: readonly T[]
): T[] {
  const allowed = new Set<string>(allowedValues);
  return [...new Set(params.getAll(key).filter((value) => allowed.has(value)))] as T[];
}

function readFiltersFromUrl(): DiscoveryFilters {
  if (typeof window === "undefined") {
    return { moods: [], energies: [], territories: [] };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    moods: readParamValues(params, "mood", ALL_MOODS),
    energies: readParamValues(params, "energy", ALL_ENERGIES),
    territories: readParamValues(params, "territory", ALL_TERRITORIES),
  };
}

function hasSelectedFilters(filters: DiscoveryFilters): boolean {
  return (
    filters.moods.length > 0 ||
    filters.energies.length > 0 ||
    filters.territories.length > 0
  );
}

function writeFiltersToUrl(filters: DiscoveryFilters) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  params.delete("mood");
  params.delete("energy");
  params.delete("territory");

  filters.moods.forEach((mood) => params.append("mood", mood));
  filters.energies.forEach((energy) => params.append("energy", energy));
  filters.territories.forEach((territory) => params.append("territory", territory));

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}

// ── Chip variants by category ─────────────────────────────────────────────────
// active / inactive classes
const CHIP_VARIANTS = {
  yellow: {
    active:   "border-brand-yellow/60 bg-[rgba(245,196,0,0.10)] text-brand-yellow",
    inactive: "border-[#2b241c] bg-[#0d0c0b] text-[#9d9079] hover:border-[#3f3525] hover:text-[#b8aa91]",
    kicker:   "text-brand-yellow",
    dot:      "bg-brand-yellow",
  },
  green: {
    active:   "border-[#2d8c3e]/70 bg-[rgba(45,140,62,0.10)] text-[#45a65a]",
    inactive: "border-[#2b241c] bg-[#0d0c0b] text-[#9d9079] hover:border-[#263d28] hover:text-[#b8aa91]",
    kicker:   "text-[#45a65a]",
    dot:      "bg-[#2d8c3e]",
  },
  red: {
    active:   "border-brand-red/60 bg-[rgba(200,32,42,0.10)] text-[#e05560]",
    inactive: "border-[#2b241c] bg-[#0d0c0b] text-[#9d9079] hover:border-[#3d2020] hover:text-[#b8aa91]",
    kicker:   "text-[#e05560]",
    dot:      "bg-brand-red",
  },
} as const;

type Variant = keyof typeof CHIP_VARIANTS;

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({
  label,
  active,
  variant,
  onClick,
}: {
  label: string;
  active: boolean;
  variant: Variant;
  onClick: () => void;
}) {
  const v = CHIP_VARIANTS[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-1.5 text-sm transition ${
        active ? v.active : v.inactive
      }`}
    >
      {active && <span aria-hidden="true" className="mr-1 opacity-70">✓</span>}
      {label}
    </button>
  );
}

// ── Filter group ──────────────────────────────────────────────────────────────
function FilterGroup({
  label,
  variant,
  children,
}: {
  label: string;
  variant: Variant;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={`mb-2.5 block text-xs font-bold tracking-[0.28em] ${CHIP_VARIANTS[variant].kicker}`}>
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

// ── Match dots ────────────────────────────────────────────────────────────────
function MatchDots({ result }: { result: ScoredResult }) {
  return (
    <div className="flex items-center gap-1">
      {result.matchedMoods.map((m) => (
        <span key={m} title={`Humor: ${m}`} className={`h-1.5 w-1.5 rounded-full ${CHIP_VARIANTS.yellow.dot}`} />
      ))}
      {result.matchedEnergies.map((e) => (
        <span key={e} title={`Energia: ${e}`} className={`h-1.5 w-1.5 rounded-full ${CHIP_VARIANTS.green.dot}`} />
      ))}
      {result.matchedTerritories.map((t) => (
        <span key={t} title={`Território: ${t}`} className={`h-1.5 w-1.5 rounded-full ${CHIP_VARIANTS.red.dot}`} />
      ))}
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ result }: { result: ScoredResult }) {
  const album = albums.find((a) => a.catalog === result.catalog);
  if (!album) return null;
  const caption = captions[album.catalog];

  return (
    <Link
      href={`/album/${result.catalog}`}
      className={`premium-card group flex gap-4 overflow-hidden rounded-2xl border bg-[#11100e] p-4 transition ${
        result.isPartial
          ? "border-[#2b241c] hover:border-[#3f3525]"
          : "border-[#3a2e18] hover:border-brand-yellow/60"
      }`}
    >
      {/* Accent stripe */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] ${
          result.isPartial ? "bg-[#2b241c]" : "bg-brand-yellow/50"
        }`}
      />

      {/* Cover */}
      <div className="mt-0.5 h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-[#2b241c] bg-brand-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.cover}
          alt={album.album}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-[#9d9079]">TD-{album.catalog} · {album.year}</p>
            <p className="font-black leading-tight text-[#f4ead8]">{album.artist}</p>
            <p className="truncate text-sm text-[#b8aa91]">{album.album}</p>
            <p className="mt-1 text-[11px] font-bold tracking-[0.12em] text-purple-400">
              {result.role}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
            <MatchDots result={result} />
            {result.isPartial && (
              <span className="rounded-full border border-[#3a3025] px-2 py-px text-[10px] tracking-wide text-[#776d5d]">
                parcial
              </span>
            )}
          </div>
        </div>

        {/* Tese – a justificativa editorial real */}
        {caption?.tese && (
          <p className="mt-2 text-sm leading-snug text-[#9d9079] italic">
            &ldquo;{caption.tese}&rdquo;
          </p>
        )}

        <div className="mt-3 border-l border-brand-yellow/40 pl-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-brand-yellow">
            POR QUE APARECEU?
          </p>
          <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#b8aa91]">
            {result.whyAppeared.text}
          </p>
        </div>

        {/* Connection hint from connections.ts */}
        {result.primaryConnection?.relatedCatalog && (
          <p className="mt-2 text-[11px] tracking-[0.12em] text-brand-yellow/70">
            ↳ {result.primaryConnection.reason} · TD-{result.primaryConnection.relatedCatalog}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DiscoveryAssistant() {
  const [moods, setMoods]           = useState<Mood[]>([]);
  const [energies, setEnergies]     = useState<Energy[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [searchResult, setSearchResult] = useState<DiscoverySearchResult | null>(null);

  useEffect(() => {
    function restoreFromUrl() {
      const restoredFilters = readFiltersFromUrl();
      setMoods(restoredFilters.moods);
      setEnergies(restoredFilters.energies);
      setTerritories(restoredFilters.territories);
      setSearchResult(
        hasSelectedFilters(restoredFilters)
          ? scoreAlbums(albums, captionMap, restoredFilters)
          : null
      );
    }

    restoreFromUrl();
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  const totalSelected = moods.length + energies.length + territories.length;
  const searched = searchResult !== null;
  const results = searchResult?.results ?? null;

  function handleSearch() {
    const filters: DiscoveryFilters = { moods, energies, territories };
    writeFiltersToUrl(filters);
    setSearchResult(scoreAlbums(albums, captionMap, filters));
  }

  function handleMoodChange(mood: Mood) {
    const nextMoods = toggle(moods, mood);
    setMoods(nextMoods);
    writeFiltersToUrl({ moods: nextMoods, energies, territories });
    setSearchResult(null);
  }

  function handleEnergyChange(energy: Energy) {
    const nextEnergies = toggle(energies, energy);
    setEnergies(nextEnergies);
    writeFiltersToUrl({ moods, energies: nextEnergies, territories });
    setSearchResult(null);
  }

  function handleTerritoryChange(territory: Territory) {
    const nextTerritories = toggle(territories, territory);
    setTerritories(nextTerritories);
    writeFiltersToUrl({ moods, energies, territories: nextTerritories });
    setSearchResult(null);
  }

  function handleReset() {
    setMoods([]);
    setEnergies([]);
    setTerritories([]);
    setSearchResult(null);
    writeFiltersToUrl({ moods: [], energies: [], territories: [] });
  }

  const exactCount = searchResult?.totalExact ?? 0;
  const totalFound = searchResult?.totalFound ?? 0;
  const hasExact   = exactCount > 0;

  return (
    <section className="premium-card mb-10 overflow-hidden rounded-[2rem] border border-[#2b241c] bg-[#11100e]">
      {/* Yellow top rule — editorial identity */}
      <div className="h-1 bg-brand-yellow" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <p className="text-xs font-bold tracking-[0.34em] text-brand-yellow">
          ASSISTENTE DE DESCOBERTA
        </p>
        <h2 className="mt-2 text-3xl font-black leading-none sm:text-4xl">
          O que você procura hoje?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#9d9079]">
          Selecione quantos filtros quiser — a coleção responde com seus dados reais.
        </p>

        {/* Filters */}
        <div className="mt-6 space-y-5">
          <FilterGroup label="HUMOR / TOM" variant="yellow">
            {ALL_MOODS.map((mood) => (
              <Chip
                key={mood}
                label={MOOD_LABELS[mood]}
                active={moods.includes(mood)}
                variant="yellow"
                onClick={() => handleMoodChange(mood)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="ENERGIA" variant="green">
            {ALL_ENERGIES.map((e) => (
              <Chip
                key={e}
                label={ENERGY_LABELS[e]}
                active={energies.includes(e)}
                variant="green"
                onClick={() => handleEnergyChange(e)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="TERRITÓRIO" variant="red">
            {ALL_TERRITORIES.map((t) => (
              <Chip
                key={t}
                label={TERRITORY_LABELS[t]}
                active={territories.includes(t)}
                variant="red"
                onClick={() => handleTerritoryChange(t)}
              />
            ))}
          </FilterGroup>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSearch}
            disabled={totalSelected === 0}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-yellow px-6 text-sm text-brand-yellow transition hover:bg-brand-yellow hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            Buscar na coleção →
          </button>
          {searched && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-[#2b241c] px-4 py-2 text-sm text-[#9d9079] transition hover:border-[#4a3f32] hover:text-[#b8aa91]"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Legend */}
        {totalSelected > 0 && !searched && (
          <p className="mt-3 text-xs text-[#9d9079]">
            {totalSelected} {totalSelected === 1 ? "critério selecionado" : "critérios selecionados"}
          </p>
        )}

        {/* Results */}
        {searched && (
          <div className="mt-7 border-t border-[#2b241c] pt-6">
            {!results || results.length === 0 ? (
              <div>
                <p className="font-black text-xl">Nenhum disco encontrado.</p>
                <p className="mt-1 text-sm text-[#9d9079]">
                  Essa combinação não tem correspondência na coleção. Tente remover um filtro.
                </p>
              </div>
            ) : (
              <>
                {/* Result header */}
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.28em] text-brand-yellow">
                      {hasExact ? "DISCOS ENCONTRADOS" : "CORRESPONDÊNCIA PARCIAL"}
                    </p>
                    <p className="mt-0.5 text-sm text-[#9d9079]">
                      {hasExact
                        ? `${totalFound} ${totalFound === 1 ? "disco encontrado" : "discos encontrados"} no total · ${exactCount} satisfaz${exactCount === 1 ? "" : "em"} todos os critérios`
                        : `${totalFound} ${totalFound === 1 ? "disco encontrado" : "discos encontrados"} no total — mostrando os mais próximos`}
                    </p>
                  </div>
                  {/* Dot legend */}
                  <div className="hidden shrink-0 flex-col gap-1 text-right text-[10px] text-[#776d5d] sm:flex">
                    <span><span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-yellow mr-1 align-middle" />humor</span>
                    <span><span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2d8c3e] mr-1 align-middle" />energia</span>
                    <span><span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-red mr-1 align-middle" />território</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {results.map((result) => (
                    <ResultCard key={result.catalog} result={result} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
