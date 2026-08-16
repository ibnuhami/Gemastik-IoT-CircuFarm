#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <ArduinoJson.h>
#include "dht_sensor.h"
#include "soil_sensor.h"
#include "water_level_sensor.h"
#include "ds18b20_sensor.h"
#include "../json_builder.h"

inline void initAllSensors()
{
  initDHT();
  initSoilSensor();
  initDS18B20();
  initWaterLevel();
  Serial.println("🟢 Semua Hardware Sensor Berhasil Di-inisialisasi!");
}

inline String collectAllSensorPayload()
{
  // 1. Buat dokumen JSON bawaan ArduinoJson
  JsonDocument doc;

  // 2. Buat array utama [ ... ]
  JsonArray rootArray = doc.to<JsonArray>();

  // ==========================================
  // SEKTOR 1: Livestock BSF
  // ==========================================
  JsonObject bsfObj = rootArray.add<JsonObject>();
  bsfObj["sector"] = "livestock_bsf";

  // Membungkus data dht11
  JsonObject dhtObj = bsfObj["dht11"].to<JsonObject>();
  appendDHTPayload(dhtObj);

  // Membungkus data soil
  JsonObject soilObj = bsfObj["soil"].to<JsonObject>();
  appendSoilPayload(soilObj);

  // ==========================================
  // SEKTOR 2: Aquaculture (Contoh Tambahan)
  // ==========================================
  JsonObject aquaObj = rootArray.add<JsonObject>();
  aquaObj["sector"] = "aquaculture";

  JsonObject waterLevelObj = aquaObj["water_level"].to<JsonObject>();
  appendWaterLevelPayload(waterLevelObj);

  JsonObject ds18b20Obj = aquaObj["ds18b20"].to<JsonObject>();
  appendDS18B20Payload(ds18b20Obj);

  // 3. Konversi menjadi String
  String output;
  serializeJson(doc, output);
  return output;
}

#endif