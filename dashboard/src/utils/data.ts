export interface SensorData {
    temp: number;    // temperature (20-30 range)
    hum: number;     // humidity (40-60 range)
    rtc: string;     // time string (HH:MM:SS format)
    rain: number;    // rain presence (0 or 1)
    soil: number;    // soil moisture (0-100 range)
    tilt: number;    // movement/fall detection (0 or 1)
}