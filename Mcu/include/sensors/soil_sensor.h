#ifndef SOIL_SENSOR_H
#define SOIL_SENSOR_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include "../config.h"

#ifndef SOIL_PIN
#define SOIL_PIN 34 // Pin default jika belum di-define di config.h
#endif

inline void initSoilSensor()
{
  pinMode(SOIL_PIN, INPUT);
}

inline float readSoilMoisture()
{
  int rawAnalog = analogRead(SOIL_PIN);
  float percentage = map(rawAnalog, 4095, 0, 0, 100);
  return constrain(percentage, 0, 100);
}

inline void appendSoilPayload(JsonObject &json)
{
  float soilPercentage = readSoilMoisture();
  if (isnan(soilPercentage))
  {
    json["node_id"] = "SOIL-01";
    json["bsf_media_moisture_pct"] = 0.0;
    json["status"] = "warning";
    json["soil_error"] = true;
  }
  else
  {
    json["node_id"] = "SOIL-01";
    json["bsf_media_moisture_pct"] = soilPercentage;
    json["status"] = "running";
  }
}

#endif