'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoCharts — Sprint 11.1 Business Demo WOW Experience
//
// Pure SVG / CSS chart primitives. NO external libraries, NO data fetching.
// Everything is deterministic and static — safe for the isolated demo.
// ─────────────────────────────────────────────────────────────────────────────

import { DemoSeriesPoint, DemoSegment } from '@/lib/demo/data';
import { useCountUp, useMounted, usePrefersReducedMotion } from '@/components/demo/DemoMotion';

// ─── Area / line chart ───────────────────────────────────────────────────────

export function AreaChart({
  data,
  height = 120,
  stroke = '#2563eb',
  fillFrom = 'rgba(37,99,235,0.18)',
  fillTo = 'rgba(37,99,235,0)',
  valuePrefix = '',
  valueSuffix = '',
}: {
  data: DemoSeriesPoint[];
  height?: number;
  stroke?: string;
  fillFrom?: string;
  fillTo?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}) {
  const width = 100;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const pad = 6;
  const usable = width - pad * 2;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * usable;
    const y = height - pad - ((d.value - min) / range) * (height - pad * 2);
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const gid = `area-${stroke.replace(/[^a-z0-9]/gi, '')}`;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const drawn = reduced || mounted;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-28 w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillFrom} />
            <stop offset="100%" stopColor={fillTo} />
          </linearGradient>
        </defs>
        <path
          d={area}
          fill={`url(#${gid})`}
          style={{
            opacity: drawn ? 1 : 0,
            transition: reduced ? undefined : 'opacity 900ms ease 250ms',
          }}
        />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: reduced
              ? undefined
              : 'stroke-dashoffset 1200ms cubic-bezier(0.65,0,0.35,1)',
            filter: `drop-shadow(0 4px 6px ${fillFrom})`,
          }}
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 1.8 : 0}
            fill={stroke}
            style={{
              opacity: drawn ? 1 : 0,
              transition: reduced ? undefined : 'opacity 400ms ease 1150ms',
            }}
          />
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between px-1 text-[10px] text-gray-400">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
      <p className="sr-only">
        {data.map((d) => `${d.label}: ${valuePrefix}${d.value}${valueSuffix}`).join(', ')}
      </p>
    </div>
  );
}

// ─── Bar chart ───────────────────────────────────────────────────────────────

export function BarChart({
  data,
  color = '#1e3a5f',
  valuePrefix = '',
  valueSuffix = '',
}: {
  data: DemoSeriesPoint[];
  color?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const summary = data.map((d) => `${d.label}: ${valuePrefix}${d.value}${valueSuffix}`).join(', ');
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const grown = reduced || mounted;
  return (
    <div role="img" aria-label={summary}>
      <div className="flex h-28 items-end gap-2" aria-hidden="true">
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md"
                style={{
                  height: grown ? `${(d.value / max) * 100}%` : '0%',
                  backgroundColor: color,
                  transition: reduced
                    ? undefined
                    : `height 780ms cubic-bezier(0.22,1,0.36,1) ${i * 70}ms`,
                }}
                title={`${d.label}: ${valuePrefix}${d.value}${valueSuffix}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-gray-400">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────

export function DonutChart({
  data,
  size = 132,
  thickness = 16,
  centerLabel,
  centerValue,
}: {
  data: DemoSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const shown = reduced || mounted;

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden="true"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? 'scale(1)' : 'scale(0.9)',
            transformOrigin: 'center',
            transition: reduced
              ? undefined
              : 'opacity 600ms ease, transform 700ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {data.map((d) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const seg = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <span className="text-lg font-bold text-gray-900 dark:text-white">{centerValue}</span>
            )}
            {centerLabel && <span className="text-[10px] text-gray-400">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-gray-600 dark:text-gray-300">{d.label}</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal distribution bars ────────────────────────────────────────────

export function DistributionBars({ data }: { data: DemoSegment[] }) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const grown = reduced || mounted;
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-gray-600 dark:text-gray-300">{d.label}</span>
          <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-2 rounded-full"
              style={{
                width: grown ? `${(d.value / max) * 100}%` : '0%',
                backgroundColor: d.color,
                transition: reduced
                  ? undefined
                  : `width 760ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
              }}
            />
          </div>
          <span className="w-10 text-right text-sm font-medium text-gray-900 dark:text-white">
            {d.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Radial score gauge ──────────────────────────────────────────────────────

export function ScoreGauge({
  score,
  size = 132,
  thickness = 14,
  color = '#059669',
  label = 'Compliance Score',
}: {
  score: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const shown = reduced || mounted;
  const animatedScore = useCountUp(score, 1200);
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-800"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            style={{
              strokeDashoffset: shown ? 0 : dash,
              transition: reduced
                ? undefined
                : 'stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(animatedScore)}
          </span>
          <span className="text-[10px] text-gray-400">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}

// ─── Compact inline sparkline ────────────────────────────────────────────────

export function Sparkline({
  data,
  stroke = '#2563eb',
  className = 'h-8 w-20',
}: {
  data: number[];
  stroke?: string;
  className?: string;
}) {
  const width = 100;
  const height = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const drawn = reduced || mounted;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          transition: reduced ? undefined : 'stroke-dashoffset 1000ms cubic-bezier(0.65,0,0.35,1)',
        }}
      />
    </svg>
  );
}
