const COLORS = {
  yellow: "#f5c400",
  purple: "#a347b6",
  green: "#45a65a",
  red: "#dc3d46",
  cream: "#f4ead8",
  muted: "#9d9079",
  grid: "#2b241c",
};

const GENRE_COLORS: Record<string, string> = {
  Reggae: COLORS.green,
  "Hip-Hop": COLORS.purple,
  Jazz: COLORS.yellow,
  "MPB/Samba": COLORS.red,
  Outros: COLORS.muted,
};

type GenrePoint = { name: string; value: number };
type DecadePoint = { decade: string; count: number };
type OriginPoint = { name: string; value: number };
type NetworkPoint = {
  catalog: string;
  artist: string;
  album: string;
  cover: string;
  count: number;
};

export function GenreDonut({
  data,
  total,
}: {
  data: GenrePoint[];
  total: number;
}) {
  const gradientStops = data.map((item, index) => {
    const start =
      (data
        .slice(0, index)
        .reduce((sum, previous) => sum + previous.value, 0) /
        total) *
      100;
    const end = start + (item.value / total) * 100;
    return `${GENRE_COLORS[item.name] ?? COLORS.muted} ${start}% ${end}%`;
  });

  return (
    <div className="grid items-center gap-2 sm:grid-cols-[1.1fr_0.9fr]">
      <div className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center sm:h-[250px] sm:w-[250px]">
        <div
          className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(163,71,182,0.12)]"
          style={{
            background: `conic-gradient(${gradientStops.join(", ")})`,
          }}
        />
        <div className="absolute inset-[27%] rounded-full border border-[#30271f] bg-[#11100e]" />
        <div className="pointer-events-none relative flex flex-col items-center justify-center">
          <span className="text-5xl font-black leading-none text-[#f4ead8]">
            {total}
          </span>
          <span className="mt-1 text-[11px] uppercase tracking-[0.28em] text-[#9d9079]">
            discos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#2b241c] bg-black/20 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: GENRE_COLORS[item.name] ?? COLORS.muted }}
              />
              <span className="truncate text-sm text-[#b8aa91]">{item.name}</span>
            </div>
            <span className="font-black text-[#f4ead8]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DecadeColumns({ data }: { data: DecadePoint[] }) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="relative mt-5 grid h-[250px] grid-cols-8 items-end gap-2 border-b border-[#3a3025] px-1 pb-7 sm:gap-3">
      <div className="pointer-events-none absolute inset-x-0 top-1/4 border-t border-dashed border-[#2b241c]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-[#2b241c]" />
      <div className="pointer-events-none absolute inset-x-0 top-3/4 border-t border-dashed border-[#2b241c]" />

      {data.map((item, index) => {
        const height = Math.max(10, (item.count / max) * 190);
        return (
          <div
            key={item.decade}
            className="group relative z-10 flex h-full min-w-0 items-end justify-center"
          >
            <div
              className="relative w-full max-w-12 rounded-t-lg transition group-hover:brightness-125"
              style={{
                height,
                background:
                  index === data.length - 1 ? COLORS.purple : COLORS.yellow,
                opacity: index === data.length - 1 ? 1 : 0.82,
              }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-black text-[#f4ead8]">
                {item.count}
              </span>
            </div>
            <span className="absolute -bottom-6 text-[10px] text-[#9d9079] sm:text-xs">
              {item.decade}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function OriginBars({ data }: { data: OriginPoint[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const colors = [COLORS.red, COLORS.purple, COLORS.green, COLORS.yellow];

  return (
    <div className="space-y-5 py-2">
      {data.map((item, index) => (
        <div key={item.name}>
          <div className="mb-2 flex items-end justify-between gap-4">
            <span className="text-sm text-[#f4ead8]">{item.name}</span>
            <span className="font-black text-[#f4ead8]">{item.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-black/45">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: colors[index % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConnectionOrbit({
  center,
  satellites,
}: {
  center: NetworkPoint;
  satellites: NetworkPoint[];
}) {
  const positions = [
    { x: 62, y: 66 },
    { x: 298, y: 62 },
    { x: 332, y: 196 },
    { x: 270, y: 302 },
    { x: 92, y: 302 },
    { x: 28, y: 190 },
  ];

  return (
    <div>
      <div className="mx-auto max-w-[430px]">
        <svg
          viewBox="0 0 360 360"
          role="img"
          aria-label={`Rede de conexões centrada em ${center.artist}`}
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <radialGradient id="networkGlow">
              <stop offset="0%" stopColor={COLORS.purple} stopOpacity="0.55" />
              <stop offset="100%" stopColor={COLORS.purple} stopOpacity="0" />
            </radialGradient>
            <clipPath id="centerCoverClip">
              <circle cx="180" cy="180" r="43" />
            </clipPath>
          </defs>

          <circle cx="180" cy="180" r="116" fill="url(#networkGlow)" opacity="0.35" />
          <circle
            cx="180"
            cy="180"
            r="108"
            fill="none"
            stroke="#3a3025"
            strokeDasharray="3 7"
          />

          {satellites.slice(0, 6).map((item, index) => {
            const position = positions[index];
            return (
              <g key={item.catalog}>
                <line
                  x1="180"
                  y1="180"
                  x2={position.x}
                  y2={position.y}
                  stroke={index % 2 ? COLORS.purple : COLORS.yellow}
                  strokeOpacity="0.45"
                  strokeWidth={Math.max(1.5, item.count / 2)}
                />
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={18 + item.count}
                  fill="#15110e"
                  stroke={index % 2 ? COLORS.purple : COLORS.yellow}
                  strokeWidth="2"
                />
                <text
                  x={position.x}
                  y={position.y + 4}
                  textAnchor="middle"
                  fill={COLORS.cream}
                  fontSize="10"
                  fontWeight="700"
                >
                  {item.catalog}
                </text>
              </g>
            );
          })}

          <circle cx="180" cy="180" r="49" fill="#0c0c0c" stroke={COLORS.yellow} strokeWidth="3" />
          <image
            href={center.cover}
            x="137"
            y="137"
            width="86"
            height="86"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#centerCoverClip)"
          />
        </svg>
      </div>

      <div className="-mt-4 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-purple-400">
          TD-{center.catalog} · {center.count} conexões
        </p>
        <p className="mt-2 text-2xl font-black text-[#f4ead8]">{center.artist}</p>
        <p className="text-sm text-[#9d9079]">{center.album}</p>
      </div>
    </div>
  );
}
