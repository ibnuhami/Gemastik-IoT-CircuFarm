#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <DHT.h>
#include "../config.h"

extern DHT dht;

struct DHTData {
  float temp;
  float hum;
  bool isValid;
};

inline void initDHT() {
  dht.begin();
}

inline DHTData readDHT() {
  DHTData data;
  data.temp = dht.readTemperature();
  data.hum = dht.readHumidity();
  data.isValid = !isnan(data.temp) && !isnan(data.hum);
  return data;
}

#endif