import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SensorData } from '../types/sensor';

interface DashboardProps {
  popupText: string;
}

// Card component per le schede dei dati
interface CardProps {
  titolo: string;
  valore: React.ReactNode;
  coloreBordo: string;
  coloreTestoValore: string;
  icona: React.ReactNode;
  testid?: string;
}

const Card: React.FC<CardProps> = ({ titolo, valore, coloreBordo, coloreTestoValore, icona, testid }) => (
  <div className={`bg-white rounded-xl shadow-lg py-6 px-4 border-l-4 ${coloreBordo}`} data-testid={testid}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{titolo}</h3>
        <p className={`text-3xl font-bold ${coloreTestoValore}`}>{valore}</p>
      </div>
      <div className={`text-4xl ${coloreBordo.replace('border-l-4 ', '')}`}>{icona}</div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ popupText }) => {
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socket: Socket = io('https://panda-solid-globally.ngrok-free.app');
    socket.on('arduino-data', (msg: SensorData) => setData(msg));
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Waiting for sensor data...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        {popupText}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheda Temperatura */}
        <Card
          titolo="Temperatura"
          valore={`${data.temp}°C`}
          coloreBordo="border-red-500"
          coloreTestoValore="text-red-600"
          icona="🌡️"
          testid="card-temperatura"
        />
        {/* Scheda Umidità */}
        <Card
          titolo="Umidità"
          valore={`${data.hum}%`}
          coloreBordo="border-blue-500"
          coloreTestoValore="text-blue-600"
          icona="💧"
          testid="card-umidita"
        />
        {/* Scheda Pioggia */}
        <Card
          titolo="Pioggia"
          valore={data.rain === 1 ? 'Sì' : 'No'}
          coloreBordo="border-purple-500"
          coloreTestoValore="text-purple-600"
          icona={data.rain === 1 ? '🌧️' : '☀️'}
          testid="card-pioggia"
        />
        {/* Scheda Umidità del Suolo */}
        <Card
          titolo="Umidità del suolo"
          valore={`${data.soil}%`}
          coloreBordo="border-yellow-500"
          coloreTestoValore="text-yellow-600"
          icona="🌱"
          testid="card-suolo"
        />
        {/* Scheda Inclinazione/Movimento */}
        <Card
          titolo="Inclinazione"
          valore={data.tilt === 1 ? 'Rilevata' : 'Nessuna'}
          coloreBordo="border-orange-500"
          coloreTestoValore="text-orange-600"
          icona={data.tilt === 1 ? '⚠️' : '✅'}
          testid="card-inclinazione"
        />
        {/* Scheda Rilevamento Fumo */}
        <Card
          titolo="Rilevamento Fumo"
          valore={data.smoke === 1 ? 'Rilevato' : 'Nessuno'}
          coloreBordo="border-gray-700"
          coloreTestoValore="text-gray-700"
          icona={data.smoke === 1 ? '🔥' : '✅'}
          testid="card-fumo"
        />
      </div>
      {/* Ultimo aggiornamento */}
      <div className="mt-8 text-center text-gray-600">
        <p>Ultimo aggiornamento: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default Dashboard; 