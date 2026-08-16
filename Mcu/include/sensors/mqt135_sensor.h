#ifndef MQ135_SENSOR_H
#define MQ135_SENSOR_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include "config.h"
#include "../json_builder.h"

#ifndef MQ135_PIN
#define MQ135_PIN 34
#endif

inline void initMQ135() {
  pinMode(MQ135_PIN, INPUT);
}

// Fungsi ini bertugas menangkap, mengolah, dan memasukkan data MQ135 ke JsonBuilder
inline void appendMQ135Payload(JsonObject &json) {
  int rawVal = analogRead(MQ135_PIN);

  // Penanganan error jika pembacaan analog tidak valid
  if (rawVal <= 0 || isnan(rawVal)) {
    json["node_id"] = "MQ135-01";
    json["air_quality_raw"] = 0;
    json["status"] = "warning";
    json["mq135_error"] = true;
  } else {
    json["node_id"] = "MQ135-01";
    json["air_quality_raw"] = rawVal;
    json["status"] = (rawVal > 2500) ? "warning" : "optimal";
  }
}

#endif