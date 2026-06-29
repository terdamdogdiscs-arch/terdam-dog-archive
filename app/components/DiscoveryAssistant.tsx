"use client";

import Link from "next/link";
import { useState } from "react";
import { albums } from "../data/albums";
import { captions } from "../data/captions";
import {
  scoreAlbums,
  type DiscoveryFilters,
  type Energy,
  type Mood,
  type Territory,
} from "../lib/discoveryEngine";

// ── Label maps ────────────────────────────────────────────────────────────────

const MOOD_LABELS: Record<Mood, string> = {
  "melancólico": "Melancólico",
  "festivo": "Festivo",
  "político": "Político",
  "espiritual": "Espiritual",
  "sensual": "Sensual",
};

const ENERGY_LABELS: Record<Energy, string> = {
  "calmo": "Calmo",
  "dançante": "Dançante",
  "intenso": "Intenso",
};

const TERRITORY_LABELS: Record<Territory, string> = {
  "brasil": "Brasil",
  "jamaica": "Jamaica",
  "nova-york": "Nova York",
  "diaspora-africana": "Diáspora Africana",
};

const ALL_MOODS = Object.keys(MOOD_LABELS) as Mood[];
const ALL_ENERGIES = Object.keys(ENERGY_LABELS) as Energy[];
const ALL_TERRITORIES = Object.keys(TERRITORY_LABELS) as Territory[];

// ── Chip component ────────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-purple-500 bg-purple-900/50 text-purple-200"
          : "border-[#2b241c] bg-[#0d0c0b] text-[#9d9079] hover:border-[#4a3f32] hover:text-[#b8aa91]"
      }`}
    >
      {active ? "✓ " : ""}{label}
    </button>
  );
}

// ── Caption lookup shim (only fields the engine needs) ────────────────────────
type CaptionSlim = { tese: string; contexto: string; ponte: string };
const captionMap: Record<string, CaptionSlim> = Object.fromEntries(
  Object.entries(captions).map(([k, v]) => [
    k,
    { tese: v.tese, contexto: v.contexto, ponte: v.ponte },
  ])
);

// ── Toggle helper ─────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DiscoveryAssistant() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [energies, setEnergies] = useState<Energy[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [results, setResults] = useState<ReturnType<typeof scoreAlbums> | null>(null);
  const [searched, setSearched] = useState(false);

  const totalSelected = moods.length + energies.length + territories.length;

  function handleSearch() {
    const filters: DiscoveryFilters = { moods, energies, territories };
    setResults(scoreAlbums(albums, captionMap, filters));
    setSearched(true);
  }

  function handleReset() {
    setMoods([]);
    setEnergies([]);
    setTerritories([]);
    setResults(null);
    setSearched(false);
  }

  return (
    <section className="mb-10 overflow-hidden rounded-[2rem] border border-purple-900/60 bg-[linear-gradient(135deg,rgba(88,28,135,0.12),rgba(17,16,14,1)_60%)] p-5">
      <p className="text-xs font-bold tracking-[0.34em] text-purple-400">
        ASSISTENTE DE DESCOBERTA
      </p>
      <h2 className="mt-2 text-3xl font-black leading-tight">
        O que você procura hoje?
      </h2>
      <p className="mt-1 text-sm text-[#9d9079]">
        Escolha quantos filtros quiser. A busca usa apenas os dados da coleção — zero custo, zero API.
      </p>

      <div className="mt-5 space-y-4">
        {/* Humor / Tom */}
        <div>
          <p className="mb-2 text-xs tracking-[0.22em] text-[#9d9079]">HUMOR / TOM</p>
          <div className="flex flex-wrap gap-2">
            {ALL_MOODS.map((mood) => (
              <Chip
                key={mood}
                label={MOOD_LABELS[mood]}
                active={moods.includes(mood)}
                onClick={() => setMoods((m) => toggle(m, mood))}
              />
            ))}
          </div>
        </div>

        {/* Energia */}
        <div>
          <p className="mb-2 text-xs tracking-[0.22em] text-[#9d9079]">ENERGIA</p>
          <div className="flex flex-wrap gap-2">
            {ALL_ENERGIES.map((e) => (
              <Chip
                key={e}
                label={ENERGY_LABELS[e]}
                active={energies.includes(e)}
                onClick={() => setEnergies((prev) => toggle(prev, e))}
              />
            ))}
          </div>
        </div>

        {/* Território */}
        <div>
          <p className="mb-2 text-xs tracking-[0.22em] text-[#9d9079]">TERRITÓRIO</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TERRITORIES.map((t) => (
              <Chip
                key={t}
                label={TERRITORY_LABELS[t]}
                active={territories.includes(t)}
                onClick={() => setTerritories((prev) => toggle(prev, t))}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleSearch}
          disabled={totalSelected === 0}
          className="rounded-full border border-purple-500 bg-purple-950/40 px-5 py-2 text-sm font-medium text-purple-200 transition hover:bg-purple-900/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buscar na coleção →
        </button>
        {searched && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-[#2b241c] px-4 py-2 text-sm text-[#9d9079] transition hover:border-[#4a3f32]"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div className="mt-6 border-t border-[#2b241c] pt-5">
          {results === null || results.length === 0 ? (
            <p className="text-sm text-[#9d9079]">
              Nenhum disco correspondeu a esses critérios. Tente combinações diferentes.
            </p>
          ) : (
            <>
              <p className="mb-4 text-xs tracking-[0.22em] text-purple-400">
                {results.some((r) => !r.isPartial)
                  ? `${results.filter((r) => !r.isPartial).length} CORRESPONDÊNCIA${results.filter((r) => !r.isPartial).length === 1 ? "" : "S"} EXATA${results.filter((r) => !r.isPartial).length === 1 ? "" : "S"}`
                  : "CORRESPONDÊNCIA PARCIAL"}
              </p>

              <div className="space-y-3">
                {results.map((result) => {
                  const album = albums.find((a) => a.catalog === result.catalog);
                  if (!album) return null;
                  const caption = captions[album.catalog];
                  const isPartial = result.isPartial;

                  return (
                    <Link
                      key={result.catalog}
                      href={`/album/${result.catalog}`}
                      className={`flex gap-4 rounded-2xl border p-4 transition ${
                        isPartial
                          ? "border-[#2b241c] hover:border-[#4a3f32]"
                          : "border-purple-800/60 bg-purple-950/10 hover:border-purple-600"
                      }`}
                    >
                      {/* Cover */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2b241c] bg-brand-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={album.cover}
                          alt={album.album}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-purple-400">TD-{album.catalog}</p>
                            <p className="font-black leading-tight">{album.artist}</p>
                            <p className="text-sm text-[#b8aa91]">{album.album} · {album.year}</p>
                          </div>
                          {isPartial && (
                            <span className="shrink-0 rounded-full border border-[#3a3025] px-2 py-0.5 text-[10px] tracking-wide text-[#776d5d]">
                              parcial
                            </span>
                          )}
                        </div>

                        {caption?.tese && (
                          <p className="mt-2 text-sm italic text-[#9d9079]">
                            &ldquo;{caption.tese}&rdquo;
                          </p>
                        )}

                        <p className="mt-2 text-xs text-purple-400">
                          Ver disco →
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
