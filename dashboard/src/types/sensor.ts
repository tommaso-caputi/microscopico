import { CloudRain, RotateCcw, Droplets, Sprout, Thermometer, Flame } from "lucide-react"
import {
    getTemperatureStatus,
    getHumidityStatus,
    getRainStatus,
    getSoilStatus,
    getTiltStatus,
    getSmokeStatus,
    formatTemperature,
    formatHumidity,
    formatRain,
    formatSoil,
    formatTilt,
    formatSmoke
} from "@/utils/sensor-utils";

export interface SensorData {
    temp: number // temperature (20-30 range)
    hum: number // humidity (40-60 range)
    rain: number // rain presence (0 or 1)
    soil: number // soil moisture (0-100 range)
    tilt: number // fall detection (0 or 1)
    smoke: number // smoke detection (0 or 1)
}

export interface SensorGroup {
    id: string
    name: string
    status: "online" | "offline"
    lastUpdate: Date | null
    data: SensorData | null
}

export type SensorStatus = "normale" | "attenzione" | "critico"

export const sensorItems = [
    {
        key: "temp",
        name: "Temperatura",
        icon: Thermometer,
        color: "text-red-500",
        getValue: (data: any) => formatTemperature(data.temp),
        getStatus: (data: any) => getTemperatureStatus(data.temp),
    },
    {
        key: "hum",
        name: "Umidità",
        icon: Droplets,
        color: "text-blue-500",
        getValue: (data: any) => formatHumidity(data.hum),
        getStatus: (data: any) => getHumidityStatus(data.hum),
    },
    {
        key: "rain",
        name: "Pioggia",
        icon: CloudRain,
        color: "text-cyan-500",
        getValue: (data: any) => formatRain(data.rain),
        getStatus: (data: any) => getRainStatus(data.rain),
    },
    {
        key: "soil",
        name: "Umidità Suolo",
        icon: Sprout,
        color: "text-green-500",
        getValue: (data: any) => formatSoil(data.soil),
        getStatus: (data: any) => getSoilStatus(data.soil),
    },
    {
        key: "tilt",
        name: "Inclinazione",
        icon: RotateCcw,
        color: "text-purple-500",
        getValue: (data: any) => formatTilt(data.tilt),
        getStatus: (data: any) => getTiltStatus(data.tilt),
    },
    {
        key: "smoke",
        name: "Fumo",
        icon: Flame,
        color: "text-orange-500",
        getValue: (data: any) => formatSmoke(data.smoke),
        getStatus: (data: any) => getSmokeStatus(data.smoke),
    },
]