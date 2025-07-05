"use client"
import { useState, useEffect } from "react"
import { io, Socket } from 'socket.io-client';
import SensorDashboard from "@/components/sensor-dashboard"
import Map from "@/components/map"
import { SensorGroup, SensorData } from "@/types/sensor"
import { generateRandomSensorData } from "@/utils/sensor-utils"

export default function Home() {
  const [dashboardOpen, setDashboardOpen] = useState(false) // Start closed on mobile
  const [sensorGroups, setSensorGroups] = useState<SensorGroup[]>([
    {
      id: "gruppo-1",
      name: "Murgia",
      status: "offline",
      lastUpdate: null,
      data: null,
      position: [40.997225226176965, 16.3758999787912]
    },
    {
      id: "gruppo-2",
      name: "Politecnico",
      status: "offline",
      lastUpdate: null,
      data: null,
      position: [41.1187, 16.852]
    }
  ])

  useEffect(() => {
    const socket: Socket = io('https://panda-solid-globally.ngrok-free.app');

    socket.on('arduino-data', (msg: SensorData) => {
      // Update the first group with real socket data
      setSensorGroups(prevGroups => {
        const updatedGroups = [...prevGroups];
        if (updatedGroups[0] && msg !== null) {
          updatedGroups[0] = {
            ...updatedGroups[0],
            data: msg,
            lastUpdate: new Date(),
            status: "online"
          };
        }
        return updatedGroups;
      });
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      // Mark first group as offline when disconnected
      setSensorGroups(prevGroups => {
        const updatedGroups = [...prevGroups];
        if (updatedGroups[0]) {
          updatedGroups[0] = {
            ...updatedGroups[0],
            status: "offline"
          };
        }
        return updatedGroups;
      });
    });

    // Debug mode: generate random data for the first group only
    const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG === 'true'
    if (DEBUG_MODE) {
      const debugInterval = setInterval(() => {
        setSensorGroups(prevGroups => {
          const updatedGroups = [...prevGroups];
          if (updatedGroups[0]) {
            updatedGroups[0] = {
              ...updatedGroups[0],
              data: generateRandomSensorData(),
              lastUpdate: new Date(),
              status: "online"
            };
          }
          return updatedGroups;
        });
      }, 5000); // Update every 5 seconds

      return () => {
        clearInterval(debugInterval);
        socket.disconnect();
      };
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleDashboard = () => {
    setDashboardOpen(!dashboardOpen)
  }

  const handleMarkerClick = (groupId: string) => {
    console.log('Marker clicked:', groupId);
    // Open dashboard when marker is clicked on mobile
    if (window.innerWidth < 768) {
      setDashboardOpen(true);
    }
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden relative">
      <div className="flex-1 relative">
        <div className="w-full h-full relative">
          <Map sensorGroups={sensorGroups} onMarkerClick={handleMarkerClick} />
        </div>
      </div>

      <SensorDashboard isOpen={dashboardOpen} onToggle={toggleDashboard} sensorGroups={sensorGroups} />
    </div>
  )
}
