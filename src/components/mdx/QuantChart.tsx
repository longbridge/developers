/**
 * QuantChart.tsx
 * Port of QuantChart.vue → React, for MDX pages (CLI quant indicator docs).
 *
 * Renders a small technical-indicator chart as inline SVG. Data source is a
 * static baked-in sample (NVDA.US daily, 2026-01-02 → 2026-04-28) — no fetch,
 * no charting library. `type` selects which indicator series to draw.
 *
 * SSR note: the mdx map renders this server-side WITHOUT hydration. The full
 * static chart (grid, bars, plot lines, bands, axes, legend) renders fine at
 * SSR because it depends only on the baked-in data. The optional crosshair +
 * tooltip layer is driven by `hoverIdx` (initial `null` → renders nothing) and
 * a mousemove handler that touches the DOM only inside the event callback, so
 * render is DOM-free / SSR-safe. That hover layer only becomes interactive if
 * the component is ever hydrated as a client island; SSR-only it stays static.
 */
import React, { useMemo, useRef, useState } from 'react'
import './QuantChart.css'

// ── Geometry ────────────────────────────────────────────────────────────────
const W = 680
const H = 200
const PAD_L = 44
const PAD_R = 28
const PAD_T = 24
const PAD_B = 20
const TT_W = 108

export type QuantChartType = 'macd' | 'rsi' | 'bb' | 'ema' | 'stoch'

// ── Sample data: NVDA.US daily, 2026-01-02 → 2026-04-28 ──────────────────────
interface SeriesData {
  times: string[]
  close: (number | null)[]
  macd: (number | null)[]
  signal: (number | null)[]
  hist: (number | null)[]
  rsi: (number | null)[]
  bb_upper: (number | null)[]
  bb_mid: (number | null)[]
  bb_lower: (number | null)[]
  ema8: (number | null)[]
  ema21: (number | null)[]
  ema55: (number | null)[]
}

const RAW: SeriesData = {"times":["2026-01-02","2026-01-05","2026-01-06","2026-01-07","2026-01-08","2026-01-09","2026-01-12","2026-01-13","2026-01-14","2026-01-15","2026-01-16","2026-01-20","2026-01-21","2026-01-22","2026-01-23","2026-01-26","2026-01-27","2026-01-28","2026-01-29","2026-01-30","2026-02-02","2026-02-03","2026-02-04","2026-02-05","2026-02-06","2026-02-09","2026-02-10","2026-02-11","2026-02-12","2026-02-13","2026-02-17","2026-02-18","2026-02-19","2026-02-20","2026-02-23","2026-02-24","2026-02-25","2026-02-26","2026-02-27","2026-03-02","2026-03-03","2026-03-04","2026-03-05","2026-03-06","2026-03-09","2026-03-10","2026-03-11","2026-03-12","2026-03-13","2026-03-16","2026-03-17","2026-03-18","2026-03-19","2026-03-20","2026-03-23","2026-03-24","2026-03-25","2026-03-26","2026-03-27","2026-03-30","2026-03-31","2026-04-01","2026-04-02","2026-04-03","2026-04-06","2026-04-07","2026-04-08","2026-04-09","2026-04-13","2026-04-14","2026-04-15","2026-04-16","2026-04-17","2026-04-21","2026-04-22","2026-04-23","2026-04-24","2026-04-25","2026-04-27","2026-04-28"],"close":[148.88,149.43,150.86,149.88,153.13,134.43,130.38,136.32,131.38,135.58,138.16,128.63,132.86,136.04,139.22,144.89,136.43,156.32,157.92,155.93,154.48,153.47,152.72,164.12,166.33,173.3,171.29,175.12,175.38,172.68,172.28,162.58,153.12,147.17,154.14,131.72,133.35,138.4,136.73,133.18,118.42,108.35,107.62,105.14,102.84,99.0,90.46,99.7,104.66,113.42,120.29,119.02,126.43,123.96,128.9,136.2,134.43,141.08,132.85,144.79,137.38,133.13,130.05,121.37,108.23,100.45,100.8,112.2,130.39,133.09,136.93,148.79,153.87,155.3,157.17,167.96,169.37,172.93,175.02,184.44],"macd":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1.516,1.14,1.484,1.759,1.639,1.624,0.803,0.002,-0.613,-0.119,-1.928,-2.184,-1.906,-2.224,-2.594,-3.525,-4.44,-4.874,-5.259,-5.687,-6.199,-6.939,-5.912,-5.074,-3.743,-2.377,-2.374,-1.231,-1.333,-0.452,0.594,0.512,1.367,0.473,1.644,0.788,0.282,-0.147,-1.256,-3.073,-4.359,-4.404,-3.584,-2.057,-1.317,-0.617,1.05,2.388,2.878,3.444,4.784,5.207,5.936,5.908,6.508,7.568,8.039],"signal":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,3.641,4.094,4.577,5.175,5.748],"hist":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2.295,1.814,1.359,0.733,0.76],"rsi":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,47.39,55.83,46.01,64.86,66.17,64.44,62.94,61.65,60.64,69.38,70.84,76.93,74.66,78.26,78.37,75.39,75.02,62.97,51.95,45.27,53.08,33.61,36.77,43.07,40.95,37.77,26.39,17.54,16.78,15.25,14.1,11.45,6.24,18.78,26.82,38.28,46.33,45.37,53.31,51.0,57.03,64.49,62.35,67.91,58.7,69.2,61.48,56.94,52.84,41.26,25.88,15.09,15.36,30.77,51.97,54.92,57.65,68.53,73.22,74.32,75.82,81.38,81.14,67.61,69.81,64.64,71.5,76.28],"bb_upper":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,163.08,162.8,162.53,162.09,162.7,163.28,165.1,165.78,166.85,167.83,168.36,168.99,170.19,168.65,166.43,163.71,161.8,159.62,156.87,154.69,152.57,151.54,149.04,143.21,136.89,130.88,124.82,119.43,117.78,114.41,112.41,112.07,112.12,112.21,111.96,111.97,114.42,117.0,119.89,121.39,124.17,126.93,128.55,128.5,128.04,124.65,116.61,109.29,104.56,111.27,122.03,131.13,139.52,148.31,154.1,157.52,161.07,167.26,170.59,175.94,193.78,213.78,217.17,218.5],"bb_mid":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,148.08,147.49,146.59,145.94,146.54,147.5,149.24,149.87,151.39,152.12,152.58,152.72,152.24,151.04,149.28,148.2,146.17,144.47,142.67,140.9,139.25,136.35,132.74,129.43,126.15,122.89,119.45,116.35,114.4,113.63,113.63,114.36,115.32,116.6,117.7,119.19,121.73,124.17,126.37,127.94,129.55,131.01,131.56,131.3,130.44,128.23,124.05,120.16,116.91,115.28,120.5,125.92,130.14,136.27,141.64,145.93,150.4,157.57,161.76,165.63,174.0,182.49,186.93,189.44],"bb_lower":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,133.08,132.18,130.65,129.79,130.38,131.72,133.38,133.96,135.93,136.41,136.8,136.45,134.29,133.43,132.13,132.69,130.54,129.32,128.47,127.11,125.93,121.16,116.44,115.65,115.41,114.9,114.08,113.27,111.02,112.85,114.85,116.65,118.52,121.0,123.44,126.41,129.04,131.34,132.85,134.49,134.93,135.09,134.57,134.1,132.84,131.81,131.49,131.03,129.26,119.29,118.97,120.71,120.76,124.23,129.18,134.34,139.73,147.88,152.93,155.32,154.22,171.2,156.69,160.38],"ema8":[null,null,null,null,null,null,null,148.06,145.82,139.59,138.95,135.24,133.82,134.59,136.12,139.46,138.25,144.8,148.57,150.69,151.29,151.72,151.97,155.99,158.9,163.53,165.64,168.67,170.4,170.86,170.71,168.0,163.01,158.08,157.24,148.85,144.41,142.74,141.2,139.35,133.07,124.87,120.33,115.97,111.7,107.27,101.38,100.19,101.56,105.39,110.12,112.85,116.94,119.24,122.04,126.97,129.45,133.0,133.26,136.72,137.07,136.22,134.42,130.2,122.97,114.95,110.21,107.53,111.44,118.35,123.33,127.6,135.07,141.44,145.76,149.76,158.68,163.06,166.69,170.26,177.52],"ema21":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,152.72,152.03,151.33,152.81,154.09,156.74,157.73,159.45,160.77,161.32,161.35,159.45,155.77,152.04,151.61,145.21,142.12,140.88,139.48,138.32,132.7,124.83,120.48,115.87,111.05,106.49,100.89,100.29,100.89,103.34,106.98,109.35,112.8,114.84,118.35,123.34,126.36,130.23,130.93,134.48,135.38,134.99,133.79,129.77,122.44,114.25,109.45,107.39,110.56,114.78,118.47,125.43,131.74,136.78,140.74,147.86,152.5,157.3,161.32,169.51],"ema55":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,181.18,183.27]}

const series = RAW
const N = series.times.length

// ── Chart config per type ────────────────────────────────────────────────────
interface LineDef {
  key: string
  data: (number | null)[]
  color: string
  width?: number
}
interface BandDef {
  v: number
  color: string
}
interface TypeConfig {
  lines: LineDef[]
  bands?: BandDef[]
  hasZero?: boolean
  yPad?: number
}

const CONFIG: Record<QuantChartType, TypeConfig> = {
  macd: {
    lines: [
      { key: 'MACD', data: series.macd, color: '#06b6d4' },
      { key: 'Signal', data: series.signal, color: '#f59e0b' },
    ],
    hasZero: true,
    yPad: 1,
  },
  rsi: {
    lines: [{ key: 'RSI', data: series.rsi, color: '#3b82f6', width: 2 }],
    bands: [
      { v: 70, color: '#f97316' },
      { v: 30, color: '#22c55e' },
    ],
    yPad: 2,
  },
  bb: {
    lines: [
      { key: 'Upper', data: series.bb_upper, color: '#8b5cf6' },
      { key: 'Mid', data: series.bb_mid, color: '#6b7280', width: 1 },
      { key: 'Lower', data: series.bb_lower, color: '#8b5cf6' },
      { key: 'Close', data: series.close, color: '#22c55e', width: 1.5 },
    ],
    yPad: 5,
  },
  ema: {
    lines: [
      { key: 'EMA8', data: series.ema8, color: '#ef4444' },
      { key: 'EMA21', data: series.ema21, color: '#f97316' },
      { key: 'EMA55', data: series.ema55, color: '#3b82f6' },
      { key: 'Close', data: series.close, color: '#22c55e', width: 1 },
    ],
    yPad: 5,
  },
  stoch: {
    lines: [
      {
        key: 'K',
        data: series.rsi.map((v) => (v === null ? null : Math.min(100, Math.max(0, v * 0.95 + 5)))),
        color: '#06b6d4',
      },
      {
        key: 'D',
        data: series.rsi.map((v, i, a) => {
          if (v === null) return null
          const w = a.slice(Math.max(0, i - 2), i + 1).filter((x) => x !== null) as number[]
          return w.length ? (w.reduce((s, x) => s + x, 0) / w.length) * 0.93 + 5 : null
        }),
        color: '#f59e0b',
      },
    ],
    bands: [
      { v: 80, color: '#f97316' },
      { v: 20, color: '#22c55e' },
    ],
    yPad: 2,
  },
}

// ── Component ─────────────────────────────────────────────────────────────────
export interface QuantChartProps {
  type: QuantChartType
}

export function QuantChart({ type }: QuantChartProps) {
  const cfg = CONFIG[type] ?? CONFIG.macd

  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  // ── Y scale ──────────────────────────────────────────────────────────────
  const yRange = useMemo(() => {
    const vals: number[] = []
    for (const l of cfg.lines) l.data.forEach((v) => { if (v !== null) vals.push(v) })
    if (cfg.bands) cfg.bands.forEach((b) => vals.push(b.v))
    const pad = cfg.yPad ?? 5
    return { min: Math.min(...vals) - pad, max: Math.max(...vals) + pad }
  }, [cfg])

  const yPos = (v: number) => {
    const { min, max } = yRange
    return PAD_T + (1 - (v - min) / (max - min)) * (H - PAD_T - PAD_B)
  }

  const yTicks = useMemo(() => {
    const { min, max } = yRange
    const step = (max - min) / 4
    return [0, 1, 2, 3, 4].map((i) => parseFloat((min + i * step).toFixed(1)))
  }, [yRange])

  const formatY = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1))

  // ── X scale ──────────────────────────────────────────────────────────────
  const xPos = (i: number) => PAD_L + (i / (N - 1)) * (W - PAD_L - PAD_R)

  const xLabels = useMemo(() => {
    const step = Math.floor(N / 5)
    return [0, 1, 2, 3, 4].map((k) => {
      const i = Math.min(k * step, N - 1)
      return { i, label: series.times[i].slice(5) }
    })
  }, [])

  // ── Line points ────────────────────────────────────────────────────────────
  const linePoints = (data: (number | null)[]) => {
    const pts: string[] = []
    let seg = ''
    for (let i = 0; i < data.length; i++) {
      const v = data[i]
      if (v === null) {
        if (seg) pts.push(seg)
        seg = ''
      } else {
        seg += (seg ? ' ' : '') + `${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`
      }
    }
    if (seg) pts.push(seg)
    return pts.join(' ')
  }

  const barW = Math.max(1, (W - PAD_L - PAD_R) / N - 1)
  const hasZero = !!cfg.hasZero && yRange.min < 0 && yRange.max > 0
  const plotLines = cfg.lines
  const bands = cfg.bands ?? []

  // ── Hover / tooltip (interactive only; requires hydration to fire) ──────────
  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const el = svgRef.current
    if (!el) return
    const pt = el.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = el.getScreenCTM()
    if (!ctm) return
    const { x } = pt.matrixTransform(ctm.inverse())
    const frac = (x - PAD_L) / (W - PAD_L - PAD_R)
    setHoverIdx(Math.max(0, Math.min(N - 1, Math.round(frac * (N - 1)))))
  }

  const onMouseLeave = () => setHoverIdx(null)

  const ttH = 22 + plotLines.length * 15 + 6
  const ttX =
    hoverIdx === null
      ? 0
      : xPos(hoverIdx) + TT_W + 12 > W - PAD_R
        ? xPos(hoverIdx) - TT_W - 8
        : xPos(hoverIdx) + 8
  const ttY = PAD_T + 2

  return (
    <div className="quant-chart-wrap" data-lbus-component="quant-chart" data-quant-type={type}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="quant-chart-svg"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* grid lines */}
        {yTicks.map((y) => (
          <line key={`g${y}`} x1={PAD_L} y1={yPos(y)} x2={W - PAD_R} y2={yPos(y)} className="quant-grid" />
        ))}

        {/* histogram bars (MACD only) */}
        {type === 'macd' &&
          series.hist.map((v, i) =>
            v === null ? null : (
              <rect
                key={`h${i}`}
                x={xPos(i) - barW / 2}
                y={v >= 0 ? yPos(v) : yPos(0)}
                width={barW}
                height={Math.abs(yPos(v) - yPos(0))}
                fill={v >= 0 ? '#22c55e' : '#ef4444'}
                opacity="0.5"
              />
            )
          )}

        {/* zero line */}
        {hasZero && (
          <line
            x1={PAD_L}
            y1={yPos(0)}
            x2={W - PAD_R}
            y2={yPos(0)}
            stroke="#9ca3af"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
        )}

        {/* ob/os band lines */}
        {bands.map((band) => (
          <React.Fragment key={`band${band.v}`}>
            <line
              x1={PAD_L}
              y1={yPos(band.v)}
              x2={W - PAD_R}
              y2={yPos(band.v)}
              stroke={band.color}
              strokeWidth="1"
              strokeDasharray="4,3"
              opacity="0.7"
            />
            <text x={W - PAD_R + 3} y={yPos(band.v) + 4} fill={band.color} fontSize="9">
              {band.v}
            </text>
          </React.Fragment>
        ))}

        {/* plot lines */}
        {plotLines.map((line) => (
          <polyline
            key={line.key}
            points={linePoints(line.data)}
            stroke={line.color}
            fill="none"
            strokeWidth={line.width ?? 1.5}
          />
        ))}

        {/* y-axis labels */}
        {yTicks.map((y) => (
          <text key={`yl${y}`} x={PAD_L - 4} y={yPos(y) + 4} textAnchor="end" className="quant-axis-label">
            {formatY(y)}
          </text>
        ))}

        {/* x-axis labels */}
        {xLabels.map((lbl, i) => (
          <text key={`xl${i}`} x={xPos(lbl.i)} y={H - 4} textAnchor="middle" className="quant-axis-label">
            {lbl.label}
          </text>
        ))}

        {/* legend */}
        {plotLines.map((line, i) => (
          <g key={`lg${i}`} transform={`translate(${PAD_L + i * 90}, 8)`}>
            <line x1="0" y1="6" x2="16" y2="6" stroke={line.color} strokeWidth="2" />
            <text x="20" y="10" className="quant-legend">
              {line.key}
            </text>
          </g>
        ))}

        {/* ── hover layer (renders only after client mousemove) ── */}
        {hoverIdx !== null && (
          <>
            {/* crosshair vertical line */}
            <line
              x1={xPos(hoverIdx)}
              y1={PAD_T}
              x2={xPos(hoverIdx)}
              y2={H - PAD_B}
              stroke="var(--lb-fg-2)"
              strokeWidth="1"
              strokeDasharray="3,2"
              opacity="0.6"
            />
            {/* dots on each series */}
            {plotLines.map((line) =>
              line.data[hoverIdx] === null ? null : (
                <circle
                  key={`dot-${line.key}`}
                  cx={xPos(hoverIdx)}
                  cy={yPos(line.data[hoverIdx] as number)}
                  r="3.5"
                  fill={line.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              )
            )}
            {/* tooltip box */}
            <g transform={`translate(${ttX}, ${ttY})`}>
              <rect width={TT_W} height={ttH} rx="4" className="quant-tt-bg" strokeWidth="1" />
              <text x="8" y="14" className="quant-tt-date">
                {series.times[hoverIdx]}
              </text>
              {plotLines.map((line, i) => (
                <g key={`ttv-${line.key}`} transform={`translate(0, ${22 + i * 15})`}>
                  <circle cx="8" cy="5" r="3" fill={line.color} />
                  <text x="16" y="9" className="quant-tt-val">
                    {line.key}:{' '}
                    {line.data[hoverIdx] !== null ? formatY(line.data[hoverIdx] as number) : '—'}
                  </text>
                </g>
              ))}
            </g>
          </>
        )}
      </svg>
    </div>
  )
}
