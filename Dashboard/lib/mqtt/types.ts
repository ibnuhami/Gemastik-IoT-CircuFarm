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
  node_id: string; //[cite: 3]
  sector: "aquaculture"; //[cite: 3]
  timestamp: string; //[cite: 3]
  ph: number; //[cite: 3]
  do_mg_l: number; //[cite: 3]
  temp_c: number; //[cite: 3]
  ammonia_ppm: number; //[cite: 3]
  turbidity_ntu: number; //[cite: 3]
  actuator_status: {
    aerator: "ON" | "OFF"; //[cite: 3]
    pump_circulation: "ON" | "OFF"; //[cite: 3]
    auto_feeder: "ON" | "OFF" | "SCHEDULED"; //[cite: 3]
  };
}

// Topic #2
export interface CropTelemetry {
  node_id: string; //[cite: 3]
  sector: "crops"; //[cite: 3]
  timestamp: string; //[cite: 3]
  soil_moisture_pct: number; //[cite: 3]
  ec_ms_cm: number; //[cite: 3]
  npk: { n_ppm: number; p_ppm: number; k_ppm: number }; //[cite: 3]
  air_temp_c: number; //[cite: 3]
  air_humidity_pct: number; //[cite: 3]
  light_lux: number; //[cite: 3]
  actuator_status: {
    solenoid_valve: "OPEN" | "CLOSED"; //[cite: 3]
    nutrient_dosing_pump: "ON" | "OFF"; //[cite: 3]
  };
}

// Topic #3
export interface LivestockBsfTelemetry {
  node_id: string; //[cite: 3]
  sector: "livestock_bsf"; //[cite: 3]
  timestamp: string; //[cite: 3]
  coop_temp_c: number; //[cite: 3]
  coop_humidity_pct: number; //[cite: 3]
  ammonia_gas_ppm: number; //[cite: 3]
  methane_ppm: number; //[cite: 3]
  bsf_chamber_temp_c: number; //[cite: 3]
  bsf_larvae_age_days: number; //[cite: 3]
  manure_level_pct: number; //[cite: 3]
  actuator_status: {
    exhaust_fan: "ON" | "OFF"; //[cite: 3]
    conveyor: "ON" | "OFF"; //[cite: 3]
    bsf_mister: "ON" | "OFF"; //[cite: 3]
  };
}

// Topic #4
export interface ActuatorCommandPayload {
  target_node: string; //[cite: 3]
  actuator: string; //[cite: 3]
  command: "activate" | "deactivate"; //[cite: 3]
  duration_sec?: number; //[cite: 3]
  reason: string; //[cite: 3]
  issued_by: "rule_engine" | "web_dashboard" | string; //[cite: 3]
}

// Topic #6
export interface LoopStatusPayload {
  loop_1_aquaponic: "FLUSHING" | "SETTLING" | "RETURNING" | "IDLE"; //[cite: 3]
  loop_2_livestock_bsf: "PROCESSING" | "IDLE"; //[cite: 3]
  loop_3_feed_distribution: "FEEDING" | "IDLE"; //[cite: 3]
  updated_at: string; //[cite: 3]
}

// Topic #7
export interface SystemAlertPayload {
  severity: "critical" | "warning" | "info"; //[cite: 3]
  code: string; //[cite: 3]
  message: string; //[cite: 3]
  sector: string; //[cite: 3]
  node_id: string; //[cite: 3]
  value?: number; //[cite: 3]
  threshold?: number; //[cite: 3]
  timestamp: string; //[cite: 3]
}

// Topic #8 (LWT)
export interface NodeStatusPayload {
  node_id: string; //[cite: 3]
  status: "online" | "offline"; //[cite: 3]
  last_seen: string; //[cite: 3]
}

// Topic #9
export interface ManualOverridePayload {
  node_id: string; //[cite: 3]
  actuator: string; //[cite: 3]
  command: "activate" | "deactivate"; //[cite: 3]
  override_by: string; //[cite: 3]
  timestamp: string; //[cite: 3]
  note?: string; //[cite: 3]
}