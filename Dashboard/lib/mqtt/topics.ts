export const FARM_TOPICS = {
  // --- 1. TELEMETRY SENSOR (Node -> Hub/Dashboard) ---
  AQUACULTURE_DATA: (nodeId: string) => `farm/aquaculture/${nodeId}/data`, //
  CROPS_DATA: (nodeId: string) => `farm/crops/${nodeId}/data`, //
  LIVESTOCK_BSF_DATA: (nodeId: string) => `farm/livestock_bsf/${nodeId}/data`, //[cite: 3]

  // WILDCARD: Subscribe ke SELURUH sensor data sektor sekaligus[cite: 3]
  ALL_TELEMETRY: "farm/+/+/data", //[cite: 3]

  // --- 2. COMMAND & STATUS AKTUATOR ---
  ACTUATOR_COMMAND: (nodeId: string) => `farm/actuator/${nodeId}/command`, //[cite: 3]
  ACTUATOR_STATUS: (nodeId: string) => `farm/actuator/${nodeId}/status`, //[cite: 3]
  MANUAL_OVERRIDE: (nodeId: string) => `farm/override/${nodeId}/command`, //[cite: 3]

  // --- 3. SYSTEM, LOOPS & ALERTS ---
  LOOP_STATUS: "farm/system/loop_status", //[cite: 3]
  SYSTEM_ALERT: (severity: "critical" | "warning" | "info" | string) => `farm/alerts/${severity}`, //[cite: 3]
  ALL_ALERTS: "farm/alerts/+", //[cite: 3]
  NODE_STATUS: (nodeId: string) => `farm/system/${nodeId}/status`, //[cite: 3]
  ALL_NODES_STATUS: "farm/system/+/status", //[cite: 3]

  // --- 4. EVENTS ---
  BSF_HARVEST_EVENT: "farm/events/bsf_harvest", //[cite: 3]
} as const;