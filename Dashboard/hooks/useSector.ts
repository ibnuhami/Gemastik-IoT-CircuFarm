import { useState, useEffect } from 'react';
import { useFarmMqtt } from './useFarmMqtt';
import { LivestockBsfTelemetry } from '@/lib/mqtt/types';
import { processSectorLivestockTelemetry } from '@/services/sectors';

export function useSector() {
    const { allTelemetry } = useFarmMqtt();
    const [livestockData, setLivestockData] = useState<Record<string, unknown>>({});

    const parsedTelemetry = typeof allTelemetry === 'string'
        ? JSON.parse(allTelemetry)
        : allTelemetry ?? {};

    const bsfRawData = Object.values(parsedTelemetry).find((data) => (data as LivestockBsfTelemetry).sector === 'livestock_bsf') as LivestockBsfTelemetry | undefined;

    useEffect(() => {
        const mappingLivestock = processSectorLivestockTelemetry(bsfRawData as unknown as Record<string, LivestockBsfTelemetry>);
        setLivestockData(mappingLivestock || {});
    }, [allTelemetry]);

    return { rawTelemetry: parsedTelemetry, livestockData, bsfRawData };
}