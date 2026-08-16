#ifndef JSON_BUILDER_H
#define JSON_BUILDER_H

#include <Arduino.h>

class JsonBuilder {
private:
  String json;
  bool isFirst;

public:
  void begin() {
    json = "{";
    isFirst = true;
  }

  // Tambah data Angka (float/int)
  void add(String key, float value, int decimals = 1) {
    if (!isFirst) json += ",";
    json += "\"" + key + "\":" + String(value, decimals);
    isFirst = false;
  }

  // Tambah data Teks (string)
  void add(String key, String value) {
    if (!isFirst) json += ",";
    json += "\"" + key + "\":\"" + value + "\"";
    isFirst = false;
  }

  String end() {
    json += "}";
    return json;
  }
};

#endif