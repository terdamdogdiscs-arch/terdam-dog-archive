"use client";

import { useState } from "react";
import type { Album } from "../data/albums";

export default function CoverImage({
  album,
}: {
  album: Pick<Album, "catalog" | "album" | "artist" | "cover">;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#18130e] to-[#070707] p-2 text-center">
        <p className="font-black text-purple-400">TD-{album.catalog}</p>
        <p className="mt-1 text-[10px] text-[#9d9079]">{album.artist}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={album.cover}
      alt={album.album}
      className="h-full w-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}
