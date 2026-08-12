/**
 * Memformat pesan JavaScript/Object menjadi String JSON / Plain String untuk dikirim via MQTT.
 */
export function formatPayload(message: unknown): string {
  if (typeof message === "object" && message !== null) {
    return JSON.stringify(message);
  }
  return String(message ?? "");
}

/**
 * Mengurai (parse) payload MQTT dari Buffer/String ke JSON Object atau Fallback String.
 */
export function parsePayload<T = unknown>(rawMessage: Buffer | string): T | string {
  const str = rawMessage.toString();
  try {
    return JSON.parse(str) as T;
  } catch {
    return str;
  }
}