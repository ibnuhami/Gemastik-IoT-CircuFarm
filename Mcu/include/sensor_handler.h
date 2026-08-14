#ifndef SENSOR_HANDLER_H
#define SENSOR_HANDLER_H

#include <DHT.h>
#include "config.h"

extern DHT dht;

inline void setupSensor() {
  dht.begin();
}

// Fungsi membaca sensor dan mengembalikan string JSON
inline String getSensorDataJSON() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("❌ Gagal membaca sensor DHT!");
    return ""; // Kembalikan string kosong jika gagal
  }

  // 💡 Tampilkan hasil bacaan langsung ke Serial Monitor
  Serial.println("-----------------------------------");
  Serial.print("🌡️ Suhu       : "); Serial.print(temp, 1); Serial.println(" °C");
  Serial.print("💧 Kelembapan : "); Serial.print(hum, 0);  Serial.println(" %");
  Serial.println("-----------------------------------");

  String jsonPayload = "{";
  jsonPayload += "\"temp_c\":" + String(temp, 1) + ",";
  jsonPayload += "\"air_humidity_pct\":" + String(hum, 0) + ",";
  jsonPayload += "\"status\":\"optimal\"";
  jsonPayload += "}";

  return jsonPayload;
}

#endif