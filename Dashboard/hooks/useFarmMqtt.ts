"use client";

import { useEffect, useState, useCallback } from "react";
import { useMqtt } from "@/context/MqttContext";
import { FARM_TOPICS } from "@/lib/mqtt/topics";
import {
  AquacultureTelemetry,
  CropTelemetry,
  LivestockBsfTelemetry,
  LoopStatusPayload,
  SystemAlertPayload,
  NodeStatusPayload,
  ManualOverridePayload,
} from "@/lib/mqtt/types";

export function useFarmMqtt() {
  const { subscribe, unsubscribe, messages, publish, isConnected } = useMqtt();

  // State Penyimpanan Data
  const [aquacultureData, setAquacultureData] = useState<Record<string, AquacultureTelemetry>>({}); // -> Data Akuakultur / Perikanan
  const [cropsData, setCropsData] = useState<Record<string, CropTelemetry>>({}); // -> Data Tanaman Pangan
  const [livestockData, setLivestockData] = useState<Record<string, LivestockBsfTelemetry>>({}); // -> Data Peternakan BSF
  const [loopStatus, setLoopStatus] = useState<LoopStatusPayload | null>(null); // -> Status Loop (Sankey / State Machine)
  const [alerts, setAlerts] = useState<SystemAlertPayload[]>([]); // -> Daftar Alert / Fail-safe (Terbaru 20)
  const [nodesStatus, setNodesStatus] = useState<Record<string, NodeStatusPayload>>({}); // -> Status Online/Offline Node (LWT)
  const [allTelemetry, setAllTelemetry] = useState<Record<string, any>>({}); // -> Semua Telemetri Sektor (Wildcard)

  // 1. Subscribe Massal ke Topic yang Dibutuhkan saat First Mount
  useEffect(() => {
    if (!isConnected) return;

    // Menghubungkan wildcard topic
    subscribe(FARM_TOPICS.ALL_TELEMETRY); // Subsepsi ke farm/telemetry/+/+/data
    subscribe(FARM_TOPICS.LOOP_STATUS); // Subsepsi ke farm/system/loop_status
    subscribe(FARM_TOPICS.ALL_ALERTS); // Subsepsi ke farm/alerts/+
    subscribe(FARM_TOPICS.ALL_NODES_STATUS); // Subsepsi ke farm/system/+/status

    return () => {
      unsubscribe(FARM_TOPICS.ALL_TELEMETRY);
      unsubscribe(FARM_TOPICS.LOOP_STATUS);
      unsubscribe(FARM_TOPICS.ALL_ALERTS);
      unsubscribe(FARM_TOPICS.ALL_NODES_STATUS);
    };
  }, [isConnected, subscribe, unsubscribe]);

  // 2. Parser & Router untuk Setiap Pesan Masuk
  useEffect(() => {
    Object.keys(messages).forEach((topic) => {
      const msg = messages[topic];
      if (!msg || !msg.payload) return;

      const payload = msg.payload as any;

      // Parsing Telemetri Sektor
      // if (topic.includes("/aquaculture/")) {
      //   setAquacultureData((prev) => ({ ...prev, [payload.node_id]: payload }));
      // } else if (topic.includes("/crops/")) {
      //   setCropsData((prev) => ({ ...prev, [payload.node_id]: payload }));
      // } else if (topic.includes("/livestock_bsf/")) {
      //   setLivestockData((prev) => ({ ...prev, [payload.node_id]: payload }));
      // }

      // // Parsing Status Loop (Sankey / State Machine)
      // if (topic === FARM_TOPICS.LOOP_STATUS) {
      //   setLoopStatus(payload);
      // }

      if (topic.includes("farm/telemetry/") && topic.endsWith("/data")) {
        setAllTelemetry((prev) => ({ ...prev, [topic]: payload }));
      }

      // Parsing Alert / Fail-safe
      if (topic.startsWith("farm/alerts/")) {
        setAlerts((prev) => [payload, ...prev.slice(0, 19)]); // Simpan 20 alert terbaru
      }

      // Parsing Online/Offline (LWT)
      if (topic.startsWith("farm/system/") && topic.endsWith("/status")) {
        setNodesStatus((prev) => ({ ...prev, [payload.node_id]: payload }));
      }
    });
  }, [messages]);

  // 3. Action Handler: Manual Override dari UI Dashboard
  const triggerManualOverride = useCallback(
    (nodeId: string, actuator: string, command: "activate" | "deactivate", user: string, note?: string) => {
      const topic = FARM_TOPICS.MANUAL_OVERRIDE(nodeId); // farm/override/{node_id}/command
      const payload: ManualOverridePayload = {
        node_id: nodeId, //
        actuator, //
        command, //
        override_by: user, // Identitas penekan tombol
        timestamp: new Date().toISOString(), //
        note, //
      };

      // Disarankan menggunakan QoS 1 untuk pengiriman command penting
      publish(topic, payload);
    },
    [publish]
  );

  return {
    aquacultureData,
    cropsData,
    livestockData,
    loopStatus,
    alerts,
    nodesStatus,
    triggerManualOverride,
    allTelemetry
  };
}