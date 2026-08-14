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
  JsonBuilder json;
  json.begin();

  // Sensor Manager HANYA memanggil fungsi pengumpul dari masing-masing modul sensor
  appendDHTPayload(json);
// appendSoilPayload(json);
// appendPhPayload(json);

  return json.end();
}

#endif