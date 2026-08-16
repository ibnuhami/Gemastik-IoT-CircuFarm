"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Gauge,
  Leaf,
  Radio,
  RotateCcw,
  Sprout,
  Zap,
} from "lucide-react";
import {
  AppShell,
  PageHeading,
  SectionCard,
} from "@/components/layout/app-shell";
import {
  automationLog,
  calculateAlert,
  calculateOnlineDevices,
  getCurrentStyle,
  getStatusConfig,
  overviewTelemetry,
} from "@/services/overview";
import { sectorTelemetry } from "@/services/sectors";
import { useMqtt } from "@/context/MqttContext";
import { useFarmMqtt } from "@/hooks/useFarmMqtt";

export default function OverviewPage() {
  const {
    aquacultureData,
    cropsData,
    livestockData,
    loopStatus,
    alerts,
    nodesStatus,
    triggerManualOverride,
} = useFarmMqtt();
  const { status, reconnect } = useMqtt();
  const config = getStatusConfig(status);
  const currentStyle = getCurrentStyle(status);
  const activeDevice = calculateOnlineDevices(nodesStatus);
  const countAlert = calculateAlert(alerts);
  return (
    <AppShell>
      <PageHeading
        eyebrow="Live telemetry / 42 sensors online"
        title="The farm, at a glance."
        description="Real-time intelligence across cultivation, aquaculture, and composting systems."
      />
      <section className="mb-6 flex items-center gap-4 rounded-xl border border-amber-400/20 bg-amber-400/5 px-5 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
          <AlertTriangle className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-100">
            Attention needed in Compost Unit
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Core temperature is above the preferred range. Review ventilation
            settings.
          </p>
        </div>
        <Link
          href="/alerts"
          className="ml-auto hidden text-xs text-amber-300 sm:block"
        >
          Review alert <ChevronRight className="ml-1 inline size-3" />
        </Link>
      </section>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <SectionCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
                System flow
              </p>
              <h3 className="text-sm font-semibold text-foreground">
                Farm ecosystem
              </h3>
            </div>

            {config.canReconnect ? (
              <button
                onClick={reconnect}
                title="Klik untuk terhubung ulang"
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-300 ${config.style}`}
              >
                <RotateCcw className="size-3.5" />
                <span>{config.label}</span>
              </button>
            ) : (
              /* 🟢 JIKA CONNECTED / CONNECTING: Tampilkan sebagai Badge biasa */
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-300 ${config.style}`}
              >
                <Radio className={`size-3.5 ${config.iconAnim}`} />
                <span>{config.label}</span>
              </div>
            )}
          </div>
          <div className="mt-8 flex min-h-[230px] items-center justify-center">
            <div
              className={`relative flex size-40 items-center justify-center rounded-full text-center ${currentStyle}`}
            >
              <div>
                <Sprout className="mx-auto size-7 text-emerald-300" />
                <p className="mt-2 font-mono text-xs font-semibold">
                  CIRCUFARM
                </p>
                <p className="text-[9px] text-muted-foreground">CORE NETWORK</p>
              </div>
            </div>
          </div>
        </SectionCard>
        <SectionCard>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
            Network health
          </p>
          <h3 className="mt-1 font-semibold">Connected devices</h3>
          <div className="mt-7 grid grid-cols-2 gap-5">
            {[
              [activeDevice, "Online now"],
              [overviewTelemetry.actuatorsActive, "Actuators active"],
              [overviewTelemetry.alertsToday, "Alerts today"],
              [overviewTelemetry.uptime, "Uptime"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-mono text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <div className="mb-4 mt-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
            Sector telemetry
          </p>
          <h3 className="mt-1 text-lg font-semibold">Your systems</h3>
        </div>
        <Link
          href="/sectors"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all sectors
        </Link>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {sectorTelemetry.map((sector) => (
          <SectionCard key={sector.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <Leaf className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{sector.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {sector.metrics.length} live metrics
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {sector.status}
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {sector.metrics.map((metric, index) => (
                <div
                  key={metric}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Gauge className="size-3.5 text-cyan-300" />
                  {metric}
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <SectionCard>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-amber-300" />
            <h3 className="font-semibold">Automation log</h3>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {automationLog.map((item) => (
              <div key={item} className="flex items-center gap-3 text-xs">
                <span className="size-2 rounded-full bg-emerald-400" />
                {item}
                <span className="ml-auto text-[10px] text-muted-foreground">
                  Automated
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard>
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-cyan-300" />
            <h3 className="font-semibold">Circular efficiency</h3>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            Resource loops are operating within target ranges. Water
            recirculation and nutrient reuse remain above baseline.
          </p>
        </SectionCard>
      </div>
    </AppShell>
  );
}
