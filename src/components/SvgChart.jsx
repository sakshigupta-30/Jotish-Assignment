import { useMemo } from 'react'

function parseSalary(str) {
    if (!str) return 0
    return parseInt(String(str).replace(/[$,]/g, ''), 10) || 0
}

export default function SvgChart({ data }) {
    const cityData = useMemo(() => {
        const map = {}
        data.forEach(row => {
            const city = row[2]
            const salary = parseSalary(row[5])
            if (!map[city]) {
                map[city] = { total: 0, count: 0 }
            }
            map[city].total += salary
            map[city].count += 1
        })
        return Object.entries(map)
            .map(([city, { total, count }]) => ({ city, avg: Math.round(total / count) }))
            .sort((a, b) => b.avg - a.avg)
    }, [data])

    if (cityData.length === 0) return null

    const maxAvg = Math.max(...cityData.map(d => d.avg))
    const barHeight = 28
    const gap = 8
    const labelWidth = 120
    const chartWidth = 500
    const valueWidth = 80
    const svgWidth = labelWidth + chartWidth + valueWidth
    const svgHeight = cityData.length * (barHeight + gap) + gap

    return (
        <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full"
            style={{ maxWidth: svgWidth }}
        >
            {cityData.map((d, i) => {
                const y = gap + i * (barHeight + gap)
                const barW = maxAvg > 0 ? (d.avg / maxAvg) * chartWidth : 0
                return (
                    <g key={d.city}>
                        <text
                            x={labelWidth - 8}
                            y={y + barHeight / 2 + 1}
                            textAnchor="end"
                            dominantBaseline="middle"
                            fontSize="12"
                            fill="#6b7280"
                            fontFamily="Inter, sans-serif"
                        >
                            {d.city}
                        </text>
                        <rect
                            x={labelWidth}
                            y={y}
                            width={barW}
                            height={barHeight}
                            rx={4}
                            fill="#1a1a1a"
                        />
                        <text
                            x={labelWidth + barW + 8}
                            y={y + barHeight / 2 + 1}
                            dominantBaseline="middle"
                            fontSize="11"
                            fill="#9ca3af"
                            fontFamily="Inter, sans-serif"
                        >
                            ${d.avg.toLocaleString()}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}
