#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <ArduinoJson.h>
#include "dht_sensor.h"
#include "soil_sensor.h"
#include "ultrasonic_sensor.h"
#include "mqt135_sensor.h"
#include "water_level_sensor.h"
#include "ds18b20_sensor.h"
#include "../json_builder.h"

inline void initAllSensors()
{
  initDHT();
  initSoilSensor();
  initUltrasonic();
  initMQ135();
  initDS18B20();
  initWaterLevel();
  Serial.println("🟢 Semua Hardware Sensor Berhasil Di-inisialisasi!");
}

inline String collectAllSensorPayload()
{
  JsonDocument doc;

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

  // Membungkus data mqt135
  JsonObject mqtObj = bsfObj["mqt"].to<JsonObject>();
  appendMQ135Payload(mqtObj);

  // Membungkus data ultrasonic
  JsonObject ultraObj = bsfObj["ultrasonic"].to<JsonObject>();
  appendUltrasonicPayload(ultraObj);

  // ==========================================
  // SEKTOR 2: Aquaculture
  // ==========================================
  JsonObject aquaObj = rootArray.add<JsonObject>();
  aquaObj["sector"] = "aquaculture";

  // Membungkus data Water Level
  JsonObject waterLevelObj = aquaObj["water_level"].to<JsonObject>();
  appendWaterLevelPayload(waterLevelObj);

  // Membungkus Ds18b20 -> Suhu Air
  JsonObject ds18b20Obj = aquaObj["ds18b20"].to<JsonObject>();
  appendDS18B20Payload(ds18b20Obj);

  String output;
  serializeJson(doc, output);
  return output;
}

#endif