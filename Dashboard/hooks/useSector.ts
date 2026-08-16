import { useState, useEffect, useMemo } from 'react';
import { useFarmMqtt } from './useFarmMqtt';
import { LivestockBsfTelemetry } from '@/lib/mqtt/types';
import { processSectorLivestockTelemetry } from '@/services/sectors';

// Active Topics for subscribe Telemetry
const ACTIVE_TOPICS = [
    'farm/telemetry/livestock_and_bsf/mcu_01/data',
    'farm/telemetry/aquaqulture_and_hidroponic/mcu_01/data'
]

export function useSector() {
    const { allTelemetry } = useFarmMqtt();
    const [livestockData, setLivestockData] = useState<Record<string, unknown>>({});

    const parsedTelemetry = useMemo(() => {
        if (!allTelemetry) return {};
        if (typeof allTelemetry === 'string') {
            try {
                return JSON.parse(allTelemetry);
            } catch (err) {
                console.error("Failed to parse telemetry JSON:", err);
                return {};
            }
        }
        return allTelemetry;
    }, [allTelemetry]);

    const mappedSectors = useMemo(() => {
        const result: {
            livestock: Record<string, unknown> | null;
            aquaculture: Record<string, unknown> | null;
            hidroponic: Record<string, unknown> | null;
            bsf: Record<string, unknown> | null;
        } = {
            livestock: null,
            aquaculture: null,
            hidroponic: null,
            bsf: null,
        };

        const livestockTopic = parsedTelemetry['farm/telemetry/livestock_and_bsf/mcu_01/data'];
        if (Array.isArray(livestockTopic)) {
            const rawLivestockBsf = livestockTopic.find((item) => item.sector === 'livestock_bsf')
            if (rawLivestockBsf) {
                result.livestock = {
                    sector: 'livestock',
                    dht11: rawLivestockBsf.dht11,
                    mqt: rawLivestockBsf.mqt,
                    ultrasonic: rawLivestockBsf.ultrasonic
                }

                result.bsf = {
                    sector: 'bsf',
                    soil: rawLivestockBsf.soil
                }
            }
        }

        const aquaTopic = parsedTelemetry['farm/telemetry/aquaqulture_and_hidroponic/mcu_01/data'];
        if (Array.isArray(aquaTopic)) {
            const rawAquaHidro = aquaTopic.find((item) => item.sector === 'aquaculture_hidroponic')
            if (rawAquaHidro) {
                result.aquaculture = {
                    sector: 'aquaculture',
                    water_level: rawAquaHidro.water_level,
                    ds18b20: rawAquaHidro.ds18b20,
                };

                result.hidroponic = {
                    sector: 'hidroponic',
                    water_level: rawAquaHidro.water_level,
                    ds18b20: rawAquaHidro.ds18b20,
                };
            }
        }

        return result
    }, [parsedTelemetry]);

    return { 
        rawTelemetry: parsedTelemetry,
        livestockData: mappedSectors.livestock,
        aquacultureData: mappedSectors.aquaculture,
        bsfData: mappedSectors.bsf,
        hidroponicData: mappedSectors.hidroponic
    };
}