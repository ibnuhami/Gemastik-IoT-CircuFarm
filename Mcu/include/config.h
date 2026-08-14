#ifndef CONFIG_H
#define CONFIG_H

// ================= JARINGAN & BROKER =================
#define WIFI_SSID        "Kos Timlo"       // ⚠️ Ganti WiFi
#define WIFI_PASSWORD    "orangorangsenang23787"   // ⚠️ Ganti Password
#define MQTT_BROKER      "192.168.18.29"        // ⚠️ Ganti IP MQTT Broker
#define MQTT_PORT        1883

// ================= HARDWARE & TOPIC =================
#define DHTPIN           4                      // GPIO 4 ESP32
#define DHTTYPE          DHT11
#define TOPIC_TELEMETRY  "farm/telemetry/greenhouse_a/mcu_01/data"

#endif