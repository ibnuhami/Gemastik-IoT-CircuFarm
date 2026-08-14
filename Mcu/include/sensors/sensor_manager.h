#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include "dht_sensor.h"
// #include "soil_sensor.h"
#include "../json_builder.h"

inline void initAllSensors() {
  initDHT();
//   initSoilSensor();
  Serial.println("🟢 Semua Hardware Sensor Berhasil Di-inisialisasi!");
}

inline String collectAllSensorPayload() {
  // 1. Baca semua sensor
  DHTData dhtData = readDHT();
//   float soilMoisture = readSoilMoisture();

  // 2. Susun ke format JSON menggunakan JsonBuilder
  JsonBuilder json;
  json.begin();

  if (dhtData.isValid) {
    json.add("temp_c", dhtData.temp, 1);
    json.add("air_humidity_pct", dhtData.hum, 0);
  } else {
    json.add("temp_c", 0.0);
    json.add("air_humidity_pct", 0.0);
  }

  // Tambahkan data sensor lain dengan mudah
//   json.add("soil_moisture_pct", soilMoisture, 0);
  json.add("status", dhtData.isValid ? "optimal" : "warning");

  return json.end();
}

#endif