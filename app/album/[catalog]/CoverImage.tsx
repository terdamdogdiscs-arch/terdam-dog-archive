"use client";

import { useState } from "react";
import type { Album } from "../../data/albums";

export default function CoverImage({
  album,
}: {
  album: Pick<Album, "catalog" | "album" | "artist" | "year" | "cover">;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#18130e] to-[#070707] text-center p-6">
        <p className="text-6xl font-black text-purple-400">
          TD-{album.catalog}
        </p>

        <p className="text-xl font-black mt-4">
          {album.artist}
        </p>

        <p className="text-sm text-[#9d9079] mt-2">
          {album.year}
        </p>
      </div>
    );
  }

  return (
    <img
      src={album.cover}
      alt={album.album}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}
