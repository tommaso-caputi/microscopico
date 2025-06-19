'use client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SensorData } from '../utils/data';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    // --- SOCKET.IO LOGIC ---
    /*  socket = io('http://localhost:3001');
     socket.on('arduino-data', (sensorData: SensorData) => {
       setData(sensorData);
     });
     socket.on('connect_error', (err) => {
       console.error('Socket connection error:', err);
     });
     return () => {
       if (socket) {
         socket.off('arduino-data');
         socket.disconnect();
       }
     }; */

    // --- API POLLING LOGIC  ---
    let intervalId: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const res = await fetch('https://panda-solid-globally.ngrok-free.app/api/arduino-data');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.warn('Fetch error:', err);
      }
    };
    fetchData(); // Initial fetch
    intervalId = setInterval(fetchData, 1000); // Poll every X ms
    return () => clearInterval(intervalId);

  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Arduino Sensor Dashboard
          </h1>
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Waiting for sensor data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Arduino Sensor Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Temperature</h3>
                <p className="text-3xl font-bold text-red-600">{data.temp}°C</p>
              </div>
              <div className="text-red-500 text-4xl">🌡️</div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Humidity</h3>
                <p className="text-3xl font-bold text-blue-600">{data.hum}%</p>
              </div>
              <div className="text-blue-500 text-4xl">💧</div>
            </div>
          </div>

          {/* Rain Detection Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Rain Detection</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {data.rain === 1 ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="text-purple-500 text-4xl">
                {data.rain === 1 ? '🌧️' : '☀️'}
              </div>
            </div>
          </div>

          {/* Soil Moisture Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Soil Moisture</h3>
                <p className="text-3xl font-bold text-yellow-600">{data.soil}%</p>
              </div>
              <div className="text-yellow-500 text-4xl">🌱</div>
            </div>
          </div>

          {/* Tilt/Movement Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Tilt</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {data.tilt === 1 ? 'Detected' : 'None'}
                </p>
              </div>
              <div className="text-orange-500 text-4xl">
                {data.tilt === 1 ? '⚠️' : '✅'}
              </div>
            </div>
          </div>

          {/* Smoke Detection Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Smoke Detection</h3>
                <p className="text-3xl font-bold text-gray-700">
                  {data.smoke === 1 ? 'Detected' : 'None'}
                </p>
              </div>
              <div className="text-gray-700 text-4xl">
                {data.smoke === 1 ? '🔥' : '✅'}
              </div>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="mt-8 text-center text-gray-600">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </main>
  );
}
