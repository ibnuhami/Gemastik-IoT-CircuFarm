# Daftar Topic MQTT — Circular Integrated Farming System
### Referensi Integrasi Perangkat IoT ↔ Web Dashboard

---

## Ringkasan Cepat Semua Topic

| # | Topic Pattern | Arah | QoS Disarankan | Retained |
|---|---|---|---|---|
| 1 | `farm/aquaculture/{node_id}/data` | Node → Hub/Dashboard | 0-1 | Tidak |
| 2 | `farm/crops/{node_id}/data` | Node → Hub/Dashboard | 0-1 | Tidak |
| 3 | `farm/livestock_bsf/{node_id}/data` | Node → Hub/Dashboard | 0-1 | Tidak |
| 4 | `farm/actuator/{node_id}/command` | Hub/Dashboard → Node | 1 | Tidak |
| 5 | `farm/actuator/{node_id}/status` | Node → Hub/Dashboard | 1 | Ya |
| 6 | `farm/system/loop_status` | Hub → Dashboard | 1 | Ya |
| 7 | `farm/alerts/{severity}` | Hub → Dashboard/WA Bot | 1-2 | Tidak |
| 8 | `farm/system/{node_id}/status` | Node (LWT) → Dashboard | 1 | **Ya (wajib)** |
| 9 | `farm/override/{node_id}/command` | Dashboard → Hub/Node | 1 | Tidak |
| 10 | `farm/events/bsf_harvest` | Hub → Dashboard/Cloud | 1 | Tidak |

---

## 1. Topic Data Sensor — Aquaculture Node

**Topic:** `farm/aquaculture/{node_id}/data`
**Publisher:** ESP32 Aquaculture Node
**Subscriber:** Rule Engine (Hub), Web Dashboard
**Aksi yang terjadi:** ESP32 membaca pH, DO, suhu, amonia, turbiditas tiap 5-10 detik → publish payload → Dashboard menampilkan angka real-time → Rule Engine mengevaluasi apakah ada ambang yang terlampaui.

```json
{
  "node_id": "AQUA-01",
  "sector": "aquaculture",
  "timestamp": "2026-08-13T09:00:00+07:00",
  "ph": 7.2,
  "do_mg_l": 5.4,
  "temp_c": 27.8,
  "ammonia_ppm": 1.8,
  "turbidity_ntu": 12,
  "actuator_status": {
    "aerator": "ON",
    "pump_circulation": "OFF",
    "auto_feeder": "SCHEDULED"
  }
}
```

---

## 2. Topic Data Sensor — Crop/Hydroponic Node

**Topic:** `farm/crops/{node_id}/data`
**Publisher:** ESP32 Crop Node
**Subscriber:** Rule Engine (Hub), Web Dashboard
**Aksi yang terjadi:** ESP32 membaca soil moisture, EC/NPK (via RS485 Modbus), suhu-kelembapan udara, cahaya → publish payload → Dashboard update grafik → Rule Engine cek apakah bedengan sudah jenuh (relevan untuk Loop 1 RETURNING).

```json
{
  "node_id": "HYDRO-01",
  "sector": "crops",
  "timestamp": "2026-08-13T09:00:05+07:00",
  "soil_moisture_pct": 68,
  "ec_ms_cm": 1.8,
  "npk": { "n_ppm": 150, "p_ppm": 40, "k_ppm": 200 },
  "air_temp_c": 30.1,
  "air_humidity_pct": 65,
  "light_lux": 22000,
  "actuator_status": {
    "solenoid_valve": "OPEN",
    "nutrient_dosing_pump": "OFF"
  }
}
```

---

## 3. Topic Data Sensor — Livestock & BSF Node

**Topic:** `farm/livestock_bsf/{node_id}/data`
**Publisher:** ESP32 Livestock-BSF Node
**Subscriber:** Rule Engine (Hub), Web Dashboard
**Aksi yang terjadi:** ESP32 membaca suhu-kelembapan kandang, gas amonia/metana, level kotoran, suhu chamber BSF, umur larva → publish payload → Rule Engine cek Loop 2 (trigger conveyor) & Loop 3 (trigger panen).

```json
{
  "node_id": "LIVESTOCK-01",
  "sector": "livestock_bsf",
  "timestamp": "2026-08-13T09:00:10+07:00",
  "coop_temp_c": 31.5,
  "coop_humidity_pct": 70,
  "ammonia_gas_ppm": 18,
  "methane_ppm": 5,
  "bsf_chamber_temp_c": 29.5,
  "bsf_larvae_age_days": 9,
  "manure_level_pct": 82,
  "actuator_status": {
    "exhaust_fan": "ON",
    "conveyor": "OFF",
    "bsf_mister": "OFF"
  }
}
```

---

## 4. Topic Command Aktuator (Otomatis dari Rule Engine)

**Topic:** `farm/actuator/{node_id}/command`
**Publisher:** Rule Engine di Hub (otomatis berdasarkan logika blueprint)
**Subscriber:** ESP32 node yang bersangkutan
**Aksi yang terjadi:** Node menerima command → menyalakan/mematikan relay aktuator sesuai field `actuator` & `command` → (disarankan) node publish balik konfirmasi ke topic #5.

```json
{
  "target_node": "AQUA-01",
  "actuator": "pump_circulation",
  "command": "activate",
  "duration_sec": 600,
  "reason": "ammonia_high_trigger_biofilter",
  "issued_by": "rule_engine"
}
```

*Nilai `actuator` yang mungkin muncul per node: `aerator`, `pump_circulation`, `auto_feeder` (Aquaculture) · `solenoid_valve`, `nutrient_dosing_pump` (Crop) · `exhaust_fan`, `conveyor`, `bsf_mister`, `auto_feeder_maggot` (Livestock-BSF).*

---

## 5. Topic Konfirmasi Status Aktuator

**Topic:** `farm/actuator/{node_id}/status`
**Publisher:** ESP32 node (setelah relay benar-benar berubah state)
**Subscriber:** Dashboard (update UI toggle), Hub (verifikasi command berhasil dieksekusi — jika tidak ada konfirmasi dalam beberapa detik, bisa dianggap kegagalan aktuator/pompa)
**Aksi yang terjadi:** Dashboard mengubah tampilan indikator aktuator dari "pending" jadi status nyata.

```json
{
  "node_id": "AQUA-01",
  "actuator": "pump_circulation",
  "state": "ON",
  "changed_at": "2026-08-13T09:00:12+07:00"
}
```

---

## 6. Topic Status Loop (State Machine)

**Topic:** `farm/system/loop_status`
**Publisher:** Rule Engine di Hub
**Subscriber:** Web Dashboard
**Aksi yang terjadi:** Setiap kali status salah satu loop berubah (mengikuti state machine `FLUSHING→SETTLING→RETURNING→IDLE`), Hub publish snapshot status ketiga loop sekaligus → Dashboard menampilkan indikator visual (mis. badge warna) per loop — inilah data yang dipakai untuk visualisasi Sankey/flow diagram di dashboard.

```json
{
  "loop_1_aquaponic": "FLUSHING",
  "loop_2_livestock_bsf": "PROCESSING",
  "loop_3_feed_distribution": "IDLE",
  "updated_at": "2026-08-13T09:00:15+07:00"
}
```

---

## 7. Topic Alert / Fail-Safe

**Topic:** `farm/alerts/{severity}` — contoh: `farm/alerts/critical`, `farm/alerts/warning`
**Publisher:** Rule Engine (`fail_safe_check()`)
**Subscriber:** Dashboard (tampilkan notifikasi/badge merah), service WA Bot (kirim pesan ke operator)
**Aksi yang terjadi:** Kondisi krisis terpicu (amonia kritis, mati listrik, kegagalan pompa, suhu BSF ekstrem) → Hub publish alert → Dashboard & WA Bot subscribe topic ini secara paralel, keduanya bereaksi dari sumber data yang sama.

```json
{
  "severity": "critical",
  "code": "AMMONIA_CRITICAL",
  "message": "KRISIS: Amonia kolam pada level berbahaya",
  "sector": "aquaculture",
  "node_id": "AQUA-01",
  "value": 4.5,
  "threshold": 4.0,
  "timestamp": "2026-08-13T09:01:00+07:00"
}
```

---

## 8. Topic Status Online/Offline Node (Last Will and Testament)

**Topic:** `farm/system/{node_id}/status`
**Publisher:** ESP32 (dikonfigurasi sebagai **LWT/Last Will** saat connect ke broker) + publish manual "online" saat berhasil connect
**Subscriber:** Web Dashboard (indikator titik hijau/merah per node)
**Aksi yang terjadi:** Saat ESP32 berhasil connect ke broker, ia publish `"online"` dengan flag **retained**. Jika koneksi ESP32 terputus mendadak (mis. mati listrik/WiFi putus) **tanpa sempat disconnect dengan baik**, broker Mosquitto **otomatis** mem-publish pesan LWT `"offline"` yang sudah didaftarkan node tersebut sejak awal connect — ini penting agar dashboard tahu node benar-benar mati, bukan cuma telat kirim data.

```json
{
  "node_id": "AQUA-01",
  "status": "online",
  "last_seen": "2026-08-13T09:00:00+07:00"
}
```

*Konfigurasi LWT di firmware ESP32 (contoh dengan library PubSubClient):*
```cpp
client.connect(
  "AQUA-01",
  "farm/system/AQUA-01/status",   // LWT topic
  1,                                // QoS
  true,                             // retained
  "{\"node_id\":\"AQUA-01\",\"status\":\"offline\"}" // LWT payload
);
```

---

## 9. Topic Manual Override dari Dashboard

**Topic:** `farm/override/{node_id}/command`
**Publisher:** Web Dashboard (saat user menekan toggle switch manual di UI)
**Subscriber:** Hub (mencatat log siapa & kapan override dilakukan) dan/atau langsung ke Node
**Aksi yang terjadi:** User menekan tombol override di dashboard → payload dipublish dengan identitas user → Hub mencatat ke log audit → command diteruskan ke node yang sama seperti topic #4, tapi dengan jejak akuntabilitas siapa yang bertindak.

```json
{
  "node_id": "AQUA-01",
  "actuator": "aerator",
  "command": "activate",
  "override_by": "operator_budi",
  "timestamp": "2026-08-13T09:05:00+07:00",
  "note": "Cek manual kondisi aerator fisik"
}
```

---

## 10. Topic Event Panen BSF

**Topic:** `farm/events/bsf_harvest`
**Publisher:** Rule Engine (terpicu saat `bsf_larvae_age_days >= HARVEST_CYCLE_DAYS`)
**Subscriber:** Dashboard (log histori panen & grafik produktivitas), Cloud analytics (opsional, untuk analisis tren jangka panjang)
**Aksi yang terjadi:** Berbeda dari topic telemetri rutin — topic ini hanya publish **sesekali saat event penting terjadi** (bukan tiap beberapa detik), cocok dipakai dashboard untuk menampilkan linimasa/log historis panen.

```json
{
  "event": "bsf_harvest",
  "larvae_age_days": 12,
  "estimated_yield_kg": 3.5,
  "distributed_to": { "fish_ratio": 0.4, "livestock_ratio": 0.6 },
  "timestamp": "2026-08-13T10:00:00+07:00"
}
```

---

## Catatan Implementasi untuk Dashboard

- **Topic data sensor (#1-3)** sebaiknya di-subscribe dengan wildcard `farm/+/+/data` di satu subscription agar dashboard menerima semua sektor tanpa perlu subscribe manual satu-satu per node baru yang ditambahkan.
- **Topic status online/offline (#8)** wajib menggunakan `retained: true` — supaya saat dashboard baru dibuka/refresh, ia langsung tahu status terakhir tiap node tanpa harus menunggu node publish ulang.
- **Topic alert (#7)** sebaiknya dipisah dari topic data biasa (bukan digabung sebagai field di payload sensor) — supaya dashboard/WA Bot bisa subscribe khusus alert tanpa perlu parsing semua data telemetri untuk mencari kondisi kritis.
- Semua topic command (#4, #9) sebaiknya QoS 1 (bukan QoS 0), karena kehilangan pesan command (mis. perintah aktifkan aerator darurat) jauh lebih berisiko dibanding kehilangan satu pesan telemetri rutin.
