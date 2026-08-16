'use client'

interface MetricRowProps {
    sectorId: string
    metric: string
    livestockData?: {
        parsedMetrics?: Record<string, [number | string, string]>
    } | null
}

export function MetricRow({ sectorId, metric, livestockData }: MetricRowProps) {
    // 1. Logika Khusus Sektor BSF (Data Realtime)
    if (sectorId === 'bsf') {
        if (!livestockData) return (
            <div className="flex justify-between border-b border-border/60 pb-3 text-xs">
                <span className="text-muted-foreground"> Livestock not found</span>
            </div>
        );

        const key = metric.toLowerCase().replace(/\s+/g, '_') as keyof typeof livestockData.parsedMetrics
        const metricValue = livestockData?.parsedMetrics?.[key]

        const displayValue = metricValue && metricValue[0] !== undefined && metricValue[0] !== null
            ? `${metricValue[0]} ${metricValue[1]}`
            : '--'

        return (
            <div className="flex justify-between border-b border-border/60 pb-3 text-xs">
                <span className="text-muted-foreground">{metric}</span>
                <span className="font-mono text-foreground">{displayValue}</span>
            </div>
        )
    }

    // 2. Logika Sektor Lainnya (Data Statis Teks)
    const label = metric.split(' ')[0]
    const value = metric.substring(metric.indexOf(' ') + 1)

    return (
        <div className="flex justify-between border-b border-border/60 pb-3 text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono text-foreground">{value}</span>
        </div>
    )
}