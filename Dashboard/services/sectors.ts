import { LivestockBsfTelemetry } from "@/lib/mqtt/types"

export type SectorFilter = 
  | 'All Sectors' 
  | 'Greenhouse / Hydroponics' 
  | 'Aquaculture' 
  | 'Livestock & BSF'

export const sectorFilters: SectorFilter[] = [
  'All Sectors',
  'Greenhouse / Hydroponics',
  'Aquaculture',
  'Livestock & BSF'
]

export const sectorTelemetry = [
  {
    id: 'aquaculture',
    name: 'Aquaculture Tank',
    status: 'Optimal',
    metrics: [
      'Water pH 7.2',
      'Dissolved oxygen 6.8 mg/L',
      'Temperature 27.1 °C',
      'Ammonia 0.8 ppm'
    ]
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse A',
    status: 'Optimal',
    metrics: [
      'Moisture 68%',
      'NPK 150 / 40 / 200 ppm',
      'EC 1.8 mS/cm',
      'Light 22,000 Lux'
    ]
  },
  {
    id: 'bsf',
    name: 'Compost & BSF Unit',
    status: 'Warning',
    metrics: ['Ammonia', 'Methane', 'Chamber Temp', 'Chamber Humidity']
  }
] as const

export function processSectorLivestockTelemetry(telemetry: Record<string, LivestockBsfTelemetry> | undefined) {
    try {
        const getObjectBsf = sectorTelemetry.find((sector) => sector.id === 'bsf');
        if (!getObjectBsf || !telemetry) return null;

        return {
            ...getObjectBsf,
            status: telemetry.status || getObjectBsf.status,
            parsedMetrics: {
                ammonia: [undefined, 'ppm'],
                methane: [undefined, 'ppm'],
                chamber_temp: [telemetry.air_temp_c, '°C'],
                chamber_humidity: [telemetry.air_humidity_pct, '%']
            }
        }
    } catch (error) {
        console.log("Error processing livestock telemetry:", error);
    }
}