export interface SensorData {
    temp: number;    // temperature (20-30 range)
    hum: number;     // humidity (40-60 range)
    rain: number;    // rain presence (0 or 1)
    soil: number;    // soil moisture (0-100 range)
    tilt: number;    // fall detection (0 or 1)
    smoke: number;   // smoke detection (0 or 1)
}