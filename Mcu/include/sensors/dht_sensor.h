#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <DHT.h>
#include "config.h"
#include "../json_builder.h"

extern DHT dht;

inline void initDHT() {
  dht.begin();
}

// Fungsi ini bertugas menangkap, mengolah, dan memasukkan data DHT ke JsonBuilder
inline void appendDHTPayload(JsonBuilder &json) {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // Pengolahan data & penanganan error dilakukan di sini
  if (isnan(temp) || isnan(hum)) {
    json.add("id_device", "DHT-01");
    json.add("air_temp_c", 0.0);
    json.add("air_humidity_pct", 0.0);
    json.add("status", "warning");
    json.add("dht_error", true);
  } else {
    json.add("id_device", "DHT-01");
    json.add("air_temp_c", temp, 1);
    json.add("air_humidity_pct", hum, 0);
    json.add("status", "optimal");
  }
}

#endif