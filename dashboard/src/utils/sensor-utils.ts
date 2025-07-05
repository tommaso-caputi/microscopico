import type { SensorData, SensorStatus } from "../types/sensor"

// Funzioni per determinare lo stato dei sensori basato sui valori
export const getTemperatureStatus = (temp: number): SensorStatus => {
    if (temp < 15 || temp > 40) return "critico"
    if (temp < 18 || temp > 35) return "attenzione"
    return "normale"
}

export const getHumidityStatus = (hum: number): SensorStatus => {
    if (hum < 45 || hum > 55) return "critico"
    if (hum < 47 || hum > 53) return "attenzione"
    return "normale"
}

export const getRainStatus = (rain: number): SensorStatus => {
    return rain === 1 ? "attenzione" : "normale"
}

export const getSoilStatus = (soil: number): SensorStatus => {
    if (soil < 30) return "critico"
    if (soil < 40) return "attenzione"
    return "normale"
}

export const getTiltStatus = (tilt: number): SensorStatus => {
    return tilt === 1 ? "critico" : "normale"
}

export const getSmokeStatus = (smoke: number): SensorStatus => {
    return smoke === 1 ? "critico" : "normale"
}

// Funzioni per formattare i valori per la visualizzazione
export const formatTemperature = (temp: number): string => `${temp.toFixed(1)}°C`
export const formatHumidity = (hum: number): string => `${hum.toFixed(0)}%`
export const formatRain = (rain: number): string => (rain === 1 ? "Rilevata" : "Assente")
export const formatSoil = (soil: number): string => `${soil.toFixed(0)}%`
export const formatTilt = (tilt: number): string => (tilt === 1 ? "Rilevata" : "Normale")
export const formatSmoke = (smoke: number): string => (smoke === 1 ? "Rilevato" : "Assente")

// Funzione per ottenere lo stato generale di un gruppo
export const getGroupOverallStatus = (data: SensorData): SensorStatus => {
    const statuses = [
        getTemperatureStatus(data.temp),
        getHumidityStatus(data.hum),
        getRainStatus(data.rain),
        getSoilStatus(data.soil),
        getTiltStatus(data.tilt),
        getSmokeStatus(data.smoke),
    ]

    if (statuses.includes("critico")) return "critico"
    if (statuses.includes("attenzione")) return "attenzione"
    return "normale"
}

// Funzioni per i colori degli stati
export const getStatusColor = (status: string): string => {
    switch (status) {
        case "normale":
            return "bg-green-100 text-green-800"
        case "attenzione":
            return "bg-yellow-100 text-yellow-800"
        case "critico":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

// Funzioni per il testo dei badge degli stati
export const getStatusBadgeText = (status: string): string => {
    switch (status) {
        case "normale":
            return "Normale"
        case "attenzione":
            return "Attenzione"
        case "critico":
            return "Critico"
        default:
            return "Sconosciuto"
    }
}

// Funzioni per i colori dello stato di connessione
export const getConnectionStatusColor = (status: string): string => {
    switch (status) {
        case "online":
            return "bg-green-100 text-green-800 border-green-200"
        case "offline":
            return "bg-red-100 text-red-800 border-red-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

// Funzioni per il testo dello stato di connessione
export const getConnectionStatusText = (status: string): string => {
    switch (status) {
        case "online":
            return "Online"
        case "offline":
            return "Offline"
        default:
            return "Sconosciuto"
    }
}

// Funzione per formattare l'ultimo aggiornamento
export const formatLastUpdate = (date: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
        return "Ora"
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} min fa`
    } else {
        const hours = Math.floor(diffInMinutes / 60)
        return `${hours}h fa`
    }
}

// Function to generate random sensor data
export const generateRandomSensorData = (): SensorData => ({
    temp: Math.random() * 25 + 10, // 10-35°C
    hum: Math.random() * 40 + 30, // 30-70%
    smoke: Math.random() > 0.95 ? 1 : 0, // 5% chance of smoke
    rain: Math.random() > 0.7 ? 1 : 0, // 30% chance of rain
    soil: Math.random() * 100, // 0-100%
    tilt: Math.random() > 0.9 ? 1 : 0, // 10% chance of tilt
})

// Funzione per ottenere il colore del marker basato sullo stato del gruppo
export const getMarkerColor = (status: SensorStatus): string => {
    switch (status) {
        case "normale":
            return "#22c55e" // green-500
        case "attenzione":
            return "#eab308" // yellow-500
        case "critico":
            return "#ef4444" // red-500
        default:
            return "#6b7280" // gray-500
    }
}

