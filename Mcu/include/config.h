#ifndef CONFIG_H
#define CONFIG_H

// ================= JARINGAN & BROKER =================
#define WIFI_SSID           "Kos Timlo"       // ⚠️ Ganti WiFi
#define WIFI_PASSWORD       "orangorangsenang23787"   // ⚠️ Ganti Password
#define MQTT_BROKER         "192.168.18.29"        // ⚠️ Ganti IP MQTT Broker
#define MQTT_PORT           1883

// ================= HARDWARE & TOPIC =================
#define DHTPIN              4                       // GPIO 4 ESP32 -> DHT11
#define DHTTYPE             DHT11
#define SOIL_PIN            34                      // Soil Moisture Pin
#define DS18B20_PIN         27                      // DS18B20 Pin
#define WATER_LEVEL_PIN     33                      // Water Level Pin
#define MQ135_PIN           34                      // Mq135 Pin
#define TRIG_PIN            5                       // Ultrasonic Pin Trigger
#define ECHO_PIN            18                      // Ultrasonic Pin Echo
#define TOPIC_TELEMETRY  "farm/telemetry/aquaqulture_and_hidroponic/mcu_01/data" // Aquaqulture and Hidroponic Topic
// #define TOPIC_TELEMETRY  "farm/telemetry/livestock_and_bsf/mcu_01/data" // Livestock and BSF Topic

#endif