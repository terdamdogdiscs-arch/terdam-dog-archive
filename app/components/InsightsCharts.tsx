"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BRAND = {
  green: "#2d8c3e",
  red: "#c8202a",
  yellow: "#f5c400",
  purple: "#7b2d8b",
  black: "#0c0c0c",
};

const GENRE_COLOR: Record<string, string> = {
  Reggae: BRAND.green,
  "Hip-Hop": BRAND.purple,
  Jazz: BRAND.yellow,
  Brasil: BRAND.red,
};

type DnaPoint = { subject: string; value: number };
type ConnPoint = { catalog: string; label: string; count: number; cover: string };
type YearPoint = { period: string; count: number };

function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { subject?: string; label?: string } }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const head =
    label ?? payload[0]?.payload?.subject ?? payload[0]?.payload?.label ?? "";
  return (
    <div className="rounded-xl border border-[#2b241c] bg-[#0c0c0c] px-3 py-2 text-xs shadow-xl">
      <p className="font-black text-[#f4ead8]">{head}</p>
      <p className="text-[#b8aa91] mt-0.5">{payload[0]?.value} discos / pontos</p>
    </div>
  );
}

function GenreTick(props: {
  x?: number;
  y?: number;
  textAnchor?: "inherit" | "start" | "middle" | "end";
  payload?: { value?: string };
}) {
  const { x = 0, y = 0, textAnchor, payload } = props;
  const label = payload?.value ?? "";
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill={GENRE_COLOR[label] ?? "#b8aa91"}
      fontSize={13}
      fontWeight={700}
      dominantBaseline="central"
    >
      {label}
    </text>
  );
}

export function DnaRadar({ data }: { data: DnaPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#2b241c" />
        <PolarAngleAxis dataKey="subject" tick={<GenreTick />} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke={BRAND.yellow}
          fill={BRAND.yellow}
          fillOpacity={0.3}
        />
        <Tooltip content={<DarkTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function ConnectedBars({ data }: { data: ConnPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 46)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis
          type="number"
          allowDecimals={false}
          stroke="#9d9079"
          fontSize={11}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={132}
          tick={{ fill: "#b8aa91", fontSize: 11 }}
        />
        <Tooltip content={<DarkTooltip />} cursor={{ fill: "#ffffff10" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} fill={BRAND.purple} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function YearArea({ data }: { data: YearPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="yearFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND.yellow} stopOpacity={0.6} />
            <stop offset="100%" stopColor={BRAND.yellow} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2b241c" vertical={false} />
        <XAxis
          dataKey="period"
          stroke="#9d9079"
          fontSize={10}
          interval="preserveStartEnd"
        />
        <YAxis allowDecimals={false} stroke="#9d9079" fontSize={11} width={32} />
        <Tooltip content={<DarkTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={BRAND.yellow}
          strokeWidth={2}
          fill="url(#yearFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
