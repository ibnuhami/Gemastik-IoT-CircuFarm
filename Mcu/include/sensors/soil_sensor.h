#ifndef SOIL_SENSOR_H
#define SOIL_SENSOR_H

#include <Arduino.h>
#include "../config.h"

#ifndef SOIL_PIN
  #define SOIL_PIN 34 // Pin default jika belum di-define di config.h
#endif

inline void initSoilSensor() {
  pinMode(SOIL_PIN, INPUT);
}

inline float readSoilMoisture() {
  int rawAnalog = analogRead(SOIL_PIN);
  float percentage = map(rawAnalog, 4095, 0, 0, 100);
  return constrain(percentage, 0, 100);
}

#endif