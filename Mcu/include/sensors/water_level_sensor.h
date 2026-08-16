#ifndef WATER_LEVEL_SENSOR_H
#define WATER_LEVEL_SENSOR_H

#include <ArduinoJson.h>
#include "config.h"
#include "../json_builder.h"

#ifndef WATER_LEVEL_PIN
#define WATER_LEVEL_PIN 12
#endif

// Nilai kalibrasi sensor level air
const int WATER_LEVEL_DRY = 0;
const int WATER_LEVEL_FULL = 2500;

inline void initWaterLevel()
{
    analogReadResolution(12);
}

// Fungsi ini bertugas menangkap, mengolah, dan memasukkan data Water Level ke JsonBuilder
inline void appendWaterLevelPayload(JsonObject &json)
{
    int rawValue = analogRead(WATER_LEVEL_PIN);

    // Konversi pembacaan analog ke persentase (0 - 100%)
    int levelPct = map(rawValue, WATER_LEVEL_DRY, WATER_LEVEL_FULL, 0, 100);
    levelPct = constrain(levelPct, 0, 100);

    if (isnan(levelPct) || isnan(rawValue))
    {
        json["node_id"] = "WATER-01";
        json["error"] = true;
    }
    else
    {
        json["node_id"] = "WATER-01";
        json["water_level_pct"] = levelPct;
        json["water_level_raw"] = rawValue;
        json["status"] = "optimal";

        // Penentuan status ketinggian air
        if (levelPct <= 20)
        {
            json["water_level_status"] = "RENDAH";
        }
        else if (levelPct <= 70)
        {
            json["water_level_status"] = "NORMAL";
        }
        else
        {
            json["water_level_status"] = "TINGGI";
        }
    }
}

#endif