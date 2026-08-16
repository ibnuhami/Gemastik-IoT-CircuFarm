export const FARM_TOPICS = {
  // --- 1. TELEMETRY SENSOR (Node -> Hub/Dashboard) ---
  AQUACULTURE_DATA: (nodeId: string) => `farm/aquaculture/${nodeId}/data`, //
  CROPS_DATA: (nodeId: string) => `farm/crops/${nodeId}/data`, //
  LIVESTOCK_BSF_DATA: (nodeId: string) => `farm/livestock_bsf/${nodeId}/data`, 

  // WILDCARD: Subscribe ke SELURUH sensor data sektor sekaligus
  ALL_TELEMETRY: "farm/telemetry/+/+/data", 

  // --- 2. COMMAND & STATUS AKTUATOR ---
  ACTUATOR_COMMAND: (nodeId: string) => `farm/actuator/${nodeId}/command`, 
  ACTUATOR_STATUS: (nodeId: string) => `farm/actuator/${nodeId}/status`, 
  MANUAL_OVERRIDE: (nodeId: string) => `farm/override/${nodeId}/command`, 

  // --- 3. SYSTEM, LOOPS & ALERTS ---
  LOOP_STATUS: "farm/system/loop_status", 
  SYSTEM_ALERT: (severity: "critical" | "warning" | "info" | string) => `farm/alerts/${severity}`, 
  ALL_ALERTS: "farm/alerts/+", 
  NODE_STATUS: (nodeId: string) => `farm/system/${nodeId}/status`, 
  ALL_NODES_STATUS: "farm/system/+/status", 

  // --- 4. EVENTS ---
  BSF_HARVEST_EVENT: "farm/events/bsf_harvest", 
} as const;