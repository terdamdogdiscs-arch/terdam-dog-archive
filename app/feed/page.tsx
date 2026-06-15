"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "../components/BottomNav";
import FadeIn from "../components/FadeIn";
import CoverImage from "../components/CoverImage";
import { collectionSeed } from "../data/seed";
import { captions } from "../data/captions";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="mt-5 rounded-full border border-brand-purple px-5 py-2 text-sm tracking-[0.2em] text-brand-purple transition hover:bg-brand-purple hover:text-white"
    >
      {copied ? "LEGENDA COPIADA ✓" : "COPIAR LEGENDA"}
    </button>
  );
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-brand-black text-[#f4ead8] p-4 pb-32">
      <Link href="/" className="text-purple-400">
        ← Coleção
      </Link>

      <section className="mt-8 mb-8">
        <p className="text-sm tracking-[0.35em] text-purple-400">FEED EDITORIAL</p>
        <h1 className="text-5xl font-black mt-3 leading-none">O arquivo, disco a disco.</h1>
        <p className="text-[#b8aa91] mt-5">
          As legendas oficiais @terdamdogdiscs, em formato de feed.
        </p>
      </section>

      <section>
        {collectionSeed.map((album, index) => {
          const caption = captions[album.catalog];
          if (!caption) return null;

          return (
            <FadeIn key={album.catalog}>
              <article className="py-8">
                <div className="aspect-square w-full overflow-hidden rounded-3xl border border-[#2b241c] bg-[#11100e]">
                  <CoverImage album={album} />
                </div>

                <p className="mt-5 text-sm tracking-[0.3em] text-brand-yellow">
                  💿 Disco #{album.catalog}
                </p>

                <h2 className="text-3xl font-black mt-2 leading-tight">
                  {album.artist} — {album.album} ({album.year})
                </h2>

                <p className="mt-4 text-base italic text-[#9d9079]">{caption.ponte}</p>

                <div className="mt-4 space-y-3 text-base text-[#f0ede4] leading-relaxed">
                  {caption.contexto.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <p className="mt-5 text-2xl font-black text-brand-yellow leading-tight">
                  {caption.tese}
                </p>

                <p className="mt-4 text-sm text-brand-purple">{caption.hashtags}</p>

                <CopyButton text={caption.instagram} />
              </article>

              {index < collectionSeed.length - 1 && (
                <div className="h-px w-full bg-gradient-to-r from-brand-green to-brand-purple" />
              )}
            </FadeIn>
          );
        })}
      </section>

      <BottomNav />
    </main>
  );
}
