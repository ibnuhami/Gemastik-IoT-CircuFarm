#include <Arduino.h>
#include "config.h"
#include "wifi_handler.h"
#include "mqtt_handler.h"
#include "sensors/sensor_manager.h"

OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastSendTime = 0;
const unsigned long interval = 5000;

void setup() {
  Serial.begin(115200);
  
  setupWiFi();
  setupMQTT();
  initAllSensors(); // 👈 Menyiapkan semua sensor
}

void loop() {
  handleMQTT();

  unsigned long currentMillis = millis();
  if (currentMillis - lastSendTime >= interval) {
    lastSendTime = currentMillis;

    // 👈 Mengambil gabungan data semua sensor dalam bentuk JSON
    String jsonPayload = collectAllSensorPayload(); 
    publishTelemetry(jsonPayload);
  }
}