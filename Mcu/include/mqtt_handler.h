#ifndef MQTT_HANDLER_H
#define MQTT_HANDLER_H

#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h"

extern WiFiClient espClient;
extern PubSubClient mqttClient;

inline void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Mencoba koneksi ke MQTT Broker...");
    
    // Membuat Client ID unik otomatis berdasarkan MAC Address ESP32
    String clientId = "ESP32-Client-";
    clientId += String((uint32_t)ESP.getEfuseMac(), HEX);

    if (mqttClient.connect(clientId.c_str())) {
      Serial.print("Terhubung ke Broker! ID: ");
      Serial.println(clientId);
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Coba lagi dalam 5 detik...");
      delay(5000);
    }
  }
}

inline void setupMQTT() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setBufferSize(1024);
}

inline void handleMQTT() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();
}

inline void publishTelemetry(String payload) {
  if (payload != "") {
    Serial.print("Mengirim MQTT: ");
    Serial.println(payload);
    mqttClient.publish(TOPIC_TELEMETRY, payload.c_str(), true);
  }
}

#endif