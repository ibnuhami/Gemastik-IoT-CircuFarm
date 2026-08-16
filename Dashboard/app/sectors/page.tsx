'use client'

import { useEffect, useMemo, useState } from 'react'
import { Power, Sprout, Waves } from 'lucide-react'
import { AppShell, PageHeading, SectionCard } from '@/components/layout/app-shell'
import { sectorFilters, sectorTelemetry, type SectorFilter } from '@/services/sectors'
import { useSector } from '@/hooks/useSector'
import { MetricRow } from '@/components/ui/MetricRow'

export default function SectorsPage() {
    const [filter, setFilter] = useState<SectorFilter>('All Sectors')
    const [active, setActive] = useState<Record<string, boolean>>({
        aquaculture: true,
        greenhouse: true,
        bsf: true
    })
    const { livestockData, bsfData, aquacultureData, hidroponicData, rawTelemetry } = useSector();

    // Buat peta data berdasarkan sector.id
    const sectorDataMap: Record<string, any> = {
        livestock: livestockData,
        bsf: bsfData,
        aquaculture: aquacultureData,
        hidroponic: hidroponicData,
    };

    useEffect(() => {
        console.log("🖥️ [UI Component] Data Masuk:", rawTelemetry);
    }, [rawTelemetry]);

    const visible = useMemo(() =>
        filter === 'All Sectors'
            ? sectorTelemetry
            : sectorTelemetry.filter((item) =>
                filter.toLowerCase().includes(
                    item.id === 'bsf'
                        ? 'livestock'
                        : item.id === 'aquaculture'
                            ? 'aquaculture'
                            : 'greenhouse'
                )
            ),
        [filter]
    )

    return (
        <AppShell>
            <PageHeading
                eyebrow="Sector intelligence / live sensor matrix"
                title="Every sector, one control surface."
                description="Monitor thresholds, inspect sensor readings, and control field actuators from one place."
            />

            <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                {sectorFilters.map((item) => (
                    <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs ${filter === item
                            ? 'bg-foreground text-background'
                            : 'text-muted-foreground hover:bg-secondary'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
                {visible.map((sector) => {
                    const Icon = sector.id === 'aquaculture' ? Waves : Sprout

                    return (
                        <SectionCard key={sector.id}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                                        <Icon className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">{sector.name}</h2>
                                        <p className="text-xs text-muted-foreground">Telemetry and actuators</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] ${(sector.status as string) === 'Warning'
                                    ? 'text-amber-300'
                                    : 'text-emerald-300'
                                    }`}>
                                    {sector.status}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-col gap-3">
                                {sector.metrics.map((metric) => (
                                    <MetricRow
                                        key={metric}
                                        sectorId={sector.id}
                                        metric={metric}
                                        data={sectorDataMap[sector.id]}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setActive((current) => ({
                                    ...current,
                                    [sector.id]: !current[sector.id]
                                }))}
                                aria-pressed={active[sector.id]}
                                className="mt-5 flex w-full items-center gap-2 rounded-lg bg-secondary/70 px-3 py-2 text-xs text-muted-foreground"
                            >
                                <Power className="size-3 text-amber-300" />
                                Primary actuator
                                <span className={`ml-auto size-2 rounded-full ${active[sector.id] ? 'bg-emerald-400' : 'bg-muted'
                                    }`} />
                                {active[sector.id] ? 'Active' : 'Idle'}
                            </button>
                        </SectionCard>
                    )
                })}
            </div>
        </AppShell>
    )
}
