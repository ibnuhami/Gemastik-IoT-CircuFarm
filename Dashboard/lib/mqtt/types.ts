export type SectorStatus = 'Optimal' | 'Warning';

export type MqttStatus =
  | "CONNECTING"
  | "CONNECTED"
  | "RECONNECTING"
  | "DISCONNECTED"
  | "ERROR";

export interface MqttMessage {
  payload: unknown;
  receivedAt: string;
}

export interface MqttContextValue {
  status: MqttStatus;
  isConnected: boolean;
  messages: Record<string, MqttMessage>;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: unknown) => void;
  reconnect: () => void;
}

// #### Topic Payload Types (MQTT Messages) ####
// Topic #1
export interface AquacultureTelemetry {
  node_id: string;
  sector: "aquaculture";
  timestamp: string;
  ph: number;
  do_mg_l: number;
  temp_c: number;
  ammonia_ppm: number;
  turbidity_ntu: number;
  actuator_status: {
    aerator: "ON" | "OFF";
    pump_circulation: "ON" | "OFF";
    auto_feeder: "ON" | "OFF" | "SCHEDULED";
  };
}

// Topic #2
export interface CropTelemetry {
  node_id: string;
  sector: "crops";
  timestamp: string;
  soil_moisture_pct: number;
  ec_ms_cm: number;
  npk: { n_ppm: number; p_ppm: number; k_ppm: number };
  air_temp_c: number;
  air_humidity_pct: number;
  light_lux: number;
  actuator_status: {
    solenoid_valve: "OPEN" | "CLOSED";
    nutrient_dosing_pump: "ON" | "OFF";
  };
}

// Topic #3
export interface LivestockBsfTelemetry {
  node_id: string;
  sector: "livestock_bsf";
  timestamp: string;
  coop_temp_c: number; // Suhu udara di sekitar kandang ternak (DHT11)
  coop_humidity_pct: number; // Kelembapan udara di sekitar kandang ternak (DHT11)
  ammonia_gas_ppm: number; // Konsentrasi gas amonia di dalam kandang (PPM)
  methane_ppm: number; // Konsentrasi metana di dalam chamber BSF (PPM)
  bsf_larvae_age_days: number; // Umur larva BSF dalam hari
  manure_level_pct: number; // Ketinggian limbah organik di dalam chamber BSF (%)
  bsf_media_moisture_pct: number; // Kelembapan media pakan BSF (%)
  air_temp_c: number; // Suhu udara di sekitar chamber BSF (DHT11)
  air_humidity_pct: number; // Kelembapan udara di sekitar chamber BSF (DHT11)
  actuator_status: {
    exhaust_fan: "ON" | "OFF";
    conveyor: "ON" | "OFF";
    bsf_mister: "ON" | "OFF";
  };
}

// Topic #4
export interface ActuatorCommandPayload {
  target_node: string;
  actuator: string;
  command: "activate" | "deactivate";
  duration_sec?: number;
  reason: string;
  issued_by: "rule_engine" | "web_dashboard" | string;
}

// Topic #6
export interface LoopStatusPayload {
  loop_1_aquaponic: "FLUSHING" | "SETTLING" | "RETURNING" | "IDLE";
  loop_2_livestock_bsf: "PROCESSING" | "IDLE";
  loop_3_feed_distribution: "FEEDING" | "IDLE";
  updated_at: string;
}

// Topic #7
export interface SystemAlertPayload {
  severity: "critical" | "warning" | "info";
  code: string;
  message: string;
  sector: string;
  node_id: string;
  value?: number;
  threshold?: number;
  timestamp: string;
}

// Topic #8 (LWT)
export interface NodeStatusPayload {
  node_id: string;
  status: "online" | "offline";
  last_seen: string;
}

// Topic #9
export interface ManualOverridePayload {
  node_id: string;
  actuator: string;
  command: "activate" | "deactivate";
  override_by: string;
  timestamp: string;
  note?: string;
}

export interface Sector {
  id: string;
  name: string;
  status: SectorStatus;
  metrics: string[];
  parsedMetrics?: Record<string, [number | string, string]>;
}