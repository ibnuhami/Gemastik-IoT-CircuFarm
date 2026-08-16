#ifndef DS18B20_SENSOR_H
#define DS18B20_SENSOR_H

#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "config.h"
#include "../json_builder.h"

#ifndef DS18B20_PIN
#define DS18B20_PIN 27
#endif

extern DallasTemperature sensors;

inline void initDS18B20() {
  sensors.begin();
}

// Fungsi ini bertugas menangkap, mengolah, dan memasukkan data DS18B20 ke JsonBuilder
inline void appendDS18B20Payload(JsonObject &json) {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);

  // Penanganan error jika sensor DS18B20 terputus (-127.0 / DEVICE_DISCONNECTED_C)
  if (temp == DEVICE_DISCONNECTED_C || isnan(temp)) {
    json["node_id"] = "DS18B20-01";
    json["water_temp_c"] = 0.0;
    json["status"] = "warning";
    json["ds18b20_error"] = true;
  } else {
    json["node_id"] = "DS18B20-01";
    json["water_temp_c"] = temp;
    json["status"] = "optimal";
  }
}

#endif