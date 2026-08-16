import { LivestockBsfTelemetry, Sector } from "@/lib/mqtt/types"

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

export const sectorTelemetry: Sector[] = [
  {
    id: 'aquaculture',
    name: 'Fish Pond',
    status: 'Optimal',
    metrics: [
      'Water Temp',        // REAL — DS18B20 (`ds18b20.water_temp_c` dalam °C)
      'Water Level',       // REAL — Water Level Sensor (`water_level.water_level_pct` dalam %)
      'Water pH',          // SIMULATED — Belum ada sensor pH fisik (Nilai dummy)
      'Dissolved Oxygen',  // SIMULATED — Belum ada sensor DO fisik (Nilai dummy)
    ]
  },
  {
    id: 'greenhouse',
    name: 'Hydroponic',
    status: 'Optimal',
    metrics: [
      'Air Temp',          // REAL — DS18B20/DHT11 (`ds18b20.water_temp_c` atau `dht11.air_temp_c` dalam °C)
      'Water Level',       // REAL — Water Level Sensor (`water_level.water_level_pct` dalam %)
      'Soil Moisture',     // SIMULATED — Belum ada sensor kelembapan tanah greenhouse
      'Nutrient EC',       // SIMULATED — Belum ada sensor EC probe nutrisi
      'Light Intensity',   // SIMULATED — Belum ada sensor LDR/Lux
    ]
  },
  {
    id: 'bsf',
    name: 'Compost & BSF Unit',
    status: 'Optimal',
    metrics: [
      'Media Moisture',    // REAL — Soil Moisture Sensor (`soil.bsf_media_moisture_pct` dalam %)
      'Chamber Temp',      // REAL — DHT11 (`dht11.air_temp_c` dalam °C)
      'Chamber Humidity',  // REAL — DHT11 (`dht11.air_humidity_pct` dalam %)
      'Gas Quality',       // REAL — MQ135 (`mqt.air_quality_raw` nilai analog 0-4095)
    ]
  },
  {
    id: 'livestock',
    name: 'Livestock Enclosure',
    status: 'Optimal',
    metrics: [
      'Coop Temp',         // REAL — DHT11 (`dht11.air_temp_c` dalam °C)
      'Coop Humidity',     // REAL — DHT11 (`dht11.air_humidity_pct` dalam %)
      'Gas Quality',       // REAL — MQ135 (`mqt.air_quality_raw` nilai analog 0-4095)
      'Feed Level',        // REAL — Ultrasonic Sensor (`ultrasonic.distance_cm` dalam cm / %)
    ]
  }
] as const;

export function processSectorLivestockTelemetry(telemetry: Record<string, LivestockBsfTelemetry> | undefined) {
  try {
    const getObjectLivestock = sectorTelemetry.find((sector) => sector.id === 'livestock');
    if (!getObjectLivestock || !telemetry) return null;

    return {
      ...getObjectLivestock,
      status: telemetry.status || getObjectLivestock.status,
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

export function processSectorBsfTelemetry(telemetry: Record<string, LivestockBsfTelemetry> | undefined) {
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
    console.log("Error processing bsf telemetry:", error);
  }
}