'use client'

interface MetricRowProps {
    sectorId: string
    metric: string
    data?: Record<string, any> | null
}

// Helper untuk mengambil nilai & satuan berdasarkan sectorId dan nama metrik
function getMetricDisplayValue(sectorId: string, metricName: string, data?: Record<string, any> | null): string {
    if (!data) return '--'

    const key = metricName.toLowerCase()

    switch (sectorId) {
        case 'livestock':
            if (key.includes('temp') || key.includes('suhu')) {
                const val = data.dht11?.air_temp_c
                return val !== undefined && val !== null ? `${val} °C` : '--'
            }
            if (key.includes('humid') || key.includes('kelembapan')) {
                const val = data.dht11?.air_humidity_pct
                return val !== undefined && val !== null ? `${val} %` : '--'
            }
            if (key.includes('gas') || key.includes('ammonia') || key.includes('quality')) {
                const val = data.mqt?.air_quality_raw
                return val !== undefined && val !== null ? `${val} Raw` : '--'
            }
            if (key.includes('feed') || key.includes('distance') || key.includes('pakan')) {
                const val = data.ultrasonic?.distance_cm
                return val !== undefined && val !== null ? `${val.toFixed(1)} cm` : '--'
            }
            break

        case 'bsf':
            if (key.includes('moisture') || key.includes('media') || key.includes('soil')) {
                const val = data.soil?.bsf_media_moisture_pct
                return val !== undefined && val !== null ? `${val} %` : '--'
            }
            break

        case 'aquaculture':
        case 'hidroponic':
            if (key.includes('temp') || key.includes('suhu')) {
                const val = data.ds18b20?.water_temp_c
                return val !== undefined && val !== null ? `${val} °C` : '--'
            }
            if (key.includes('level') || key.includes('air')) {
                const val = data.water_level?.water_level_pct
                return val !== undefined && val !== null ? `${val} %` : '--'
            }
            break
    }

    return '--'
}

export function MetricRow({ sectorId, metric, data }: MetricRowProps) {
    const displayValue = getMetricDisplayValue(sectorId, metric, data)

    return (
        <div className="flex justify-between border-b border-border/60 pb-3 text-xs">
            <span className="text-muted-foreground">{metric}</span>
            <span className="font-mono text-foreground">{displayValue}</span>
        </div>
    )
}