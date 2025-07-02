'use client';
import dynamic from 'next/dynamic';
import Dashboard from './components/Dashboard';
import { useState } from 'react';

const MapWithPopups = dynamic(() => import('./components/MapWithPopups'), { ssr: false });

export default function Home() {
  const [selectedPopupText, setSelectedPopupText] = useState<string>('1');
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 px-2 pt-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-500">Microscopico Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="h-[500px] w-full">
              <MapWithPopups onMarkerClick={setSelectedPopupText} />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <Dashboard popupText={selectedPopupText} />
          </div>
        </div>
      </div>
    </main>
  );
}
