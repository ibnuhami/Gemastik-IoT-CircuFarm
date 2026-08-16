"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import mqtt, { MqttClient } from "mqtt";
import { MqttContextValue, MqttMessage, MqttStatus } from "@/lib/mqtt/types";
import { formatPayload, parsePayload } from "@/lib/mqtt/serializer";

interface MqttProviderProps {
  children: ReactNode;
  brokerUrl?: string;
}

const MqttContext = createContext<MqttContextValue | null>(null);

export function MqttProvider({ children, brokerUrl }: MqttProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<MqttStatus>("CONNECTING");
  const [messages, setMessages] = useState<Record<string, MqttMessage>>({});
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (!brokerUrl) return;

    setStatus("CONNECTING");

    const client = mqtt.connect(brokerUrl, {
      clientId: `nextjs_client_${Math.random().toString(16).substring(2, 8)}`,
      keepalive: 60,
      reconnectPeriod: 3000,
      clean: true,
    });

    clientRef.current = client;

    // context/MqttContext.tsx

    client.on("connect", (connack) => {
      console.info("✅ [MQTT Helper] Terhubung ke Broker:", brokerUrl);
      setIsConnected(true);
      setStatus("CONNECTED");
    });

    client.on("reconnect", () => {
      console.warn("🔄 [MQTT RECONNECT] Sedang mencoba terhubung ulang...");
      setIsConnected(false);
      setStatus("RECONNECTING");
    });

    client.on("error", (err) => {
      console.error("❌ [MQTT ERROR] Terjadi kesalahan koneksi:", err.message);
      setIsConnected(false);
      setStatus("ERROR");
    });

    client.on("close", () => {
      console.warn("🔌 [MQTT CLOSE] Koneksi ke broker terputus");
      setIsConnected(false);
      setStatus("DISCONNECTED");
    });

    client.on("offline", () => {
      console.warn("⚠️ [MQTT OFFLINE] Status jaringan saat ini Offline");
      setIsConnected(false);
      setStatus("DISCONNECTED");
    });

    client.on("message", (topic, message) => {
      const payload = parsePayload(message);
      setMessages((prev) => ({
        ...prev,
        [topic]: {
          payload,
          receivedAt: new Date().toLocaleTimeString(),
        },
      }));
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [brokerUrl]);

  const subscribe = useCallback((topic: string | string[]) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.subscribe(topic, (err) => {
        if (err)
          console.error(`❌ [MQTT Helper] Failed to subscribe: ${topic}`, err);
      });
    }
  }, []);

  const unsubscribe = useCallback((topic: string | string[]) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.unsubscribe(topic);
    }
  }, []);

  const publish = useCallback((topic: string, message: unknown) => {
    if (clientRef.current && clientRef.current.connected) {
      const payload = formatPayload(message);
      clientRef.current.publish(topic, payload, { qos: 0 }, (err) => {
        if (err)
          console.error(`❌ [MQTT Helper] Gagal publish ke ${topic}:`, err);
      });
    } else {
      console.warn("⚠️ [MQTT Helper] Tidak dapat mengirim, MQTT terputus");
    }
  }, []);

  const reconnect = useCallback(() => {
    if (clientRef.current) {
      setStatus("RECONNECTING");
      clientRef.current.reconnect();
    }
  }, []);

  return (
    <MqttContext.Provider
      value={{
        isConnected,
        messages,
        subscribe,
        unsubscribe,
        publish,
        status,
        reconnect,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
}

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error("useMqtt harus digunakan di dalam MqttProvider");
  }
  return context;
};
