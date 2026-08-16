#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <ArduinoJson.h>
#include <DHT.h>
#include "config.h"
#include "../json_builder.h"

extern DHT dht;

inline void initDHT() {
  dht.begin();
}

// Fungsi ini bertugas menangkap, mengolah, dan memasukkan data DHT ke JsonBuilder

inline void appendDHTPayload(JsonObject &json) {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // Pengolahan data & penanganan error dilakukan di sini
  if (isnan(temp) || isnan(hum)) {
    json["node_id"] = "DHT-01";
    json["air_temp_c"] = 0.0;
    json["air_humidity_pct"] = 0.0;
    json["status"] = "warning";
    json["dht_error"] = true;
  } else {
    json["node_id"] = "DHT-01";
    json["air_temp_c"] = temp;
    json["air_humidity_pct"] = hum;
    json["status"] = "optimal";
  }
}

#endif