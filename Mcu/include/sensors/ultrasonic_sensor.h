#ifndef ULTRASONIC_SENSOR_H
#define ULTRASONIC_SENSOR_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include "config.h"
#include "../json_builder.h"

#ifndef TRIG_PIN
#define TRIG_PIN 5
#endif

#ifndef ECHO_PIN
#define ECHO_PIN 18
#endif

inline void initUltrasonic() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);
}

// Fungsi ini bertugas menangkap, mengolah, dan memasukkan data HC-SR04 ke JsonBuilder
inline void appendUltrasonicPayload(JsonObject &json) {
  // Kirim pulsa trigger 10us
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Baca durasi pantulan echo (timeout 30ms / ~5 meter)
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  float distanceCm = duration * 0.0343f / 2.0f;

  // Penanganan error jika sinyal tidak kembali atau di luar jangkauan fisik (2cm - 400cm)
  if (duration == 0 || distanceCm < 2.0f || distanceCm > 400.0f) {
    json["node_id"] = "US-01";
    json["distance_cm"] = 0.0;
    json["status"] = "warning";
    json["ultrasonic_error"] = true;
  } else {
    json["node_id"] = "US-01";
    json["distance_cm"] = distanceCm;
    json["status"] = "optimal";
  }
}

#endif