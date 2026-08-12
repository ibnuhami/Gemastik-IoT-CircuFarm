export const MQTT_TOPICS = {
  SOIL_SENSOR: (nodeId: string) => `circufarm/sensor/soil/${nodeId}`,
  WATER_SENSOR: (nodeId: string) => `circufarm/sensor/water/${nodeId}`,
  ACTUATOR_COMMAND: (nodeId: string) => `circufarm/actuator/command/${nodeId}`,
  ACTUATOR_STATUS: (nodeId: string) => `circufarm/actuator/status/${nodeId}`,
  SYSTEM_LOGS: "circufarm/system/logs",
} as const;