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