import mqtt, { MqttClient } from "mqtt";
import { formatPayload } from "./serializer";

let serverClient: MqttClient | null = null;

export function getServerMqttClient(brokerUrl?: string): MqttClient {
  if (!serverClient) {
    const url = brokerUrl || process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
    serverClient = mqtt.connect(url, {
      clientId: `nextjs_server_${Math.random().toString(16).substring(2, 8)}`,
      clean: true,
    });

    serverClient.on("connect", () => {
      console.log("⚡ [MQTT Server Helper] Server MQTT Client Connected");
    });

    serverClient.on("error", (err) => {
      console.error("❌ [MQTT Server Helper] Server MQTT Error:", err);
    });
  }

  return serverClient;
}

/**
 * Helper untuk Publish pesan dari Backend (API Route / Server Action)
 */
export async function publishFromBackend(
  topic: string,
  message: unknown,
  brokerUrl?: string
): Promise<void> {
  const client = getServerMqttClient(brokerUrl);
  const payload = formatPayload(message);

  return new Promise((resolve, reject) => {
    client.publish(topic, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error(`❌ [Backend Publish Failed] ${topic}:`, err);
        reject(err);
      } else {
        console.log(`📤 [Backend Published] ${topic}:`, payload);
        resolve();
      }
    });
  });
}