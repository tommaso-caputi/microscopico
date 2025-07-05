"use client"
import { useState } from "react"
import SensorDashboard from "@/components/sensor-dashboard"
import Map from "@/components/map"

export default function Home() {
  const [dashboardOpen, setDashboardOpen] = useState(true)

  const toggleDashboard = () => {
    setDashboardOpen(!dashboardOpen)
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      <div className="flex-1 relative">
        <div className="w-full h-full relative">
          <Map />

          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h2 className="text-sm font-semibold text-gray-800">Area di Monitoraggio</h2>
            <p className="text-xs text-gray-600">3 Gruppi Sensori Attivi</p>
          </div>
        </div>
      </div>

      <SensorDashboard isOpen={dashboardOpen} onToggle={toggleDashboard} />
    </div>
  )
}
