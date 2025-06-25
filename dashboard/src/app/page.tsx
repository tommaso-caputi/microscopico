'use client';
import dynamic from 'next/dynamic';
import Dashboard from './components/Dashboard';

const MapWithPopups = dynamic(() => import('./components/MapWithPopups'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Microscopico Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="h-[500px] w-full">
              <MapWithPopups />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <Dashboard />
          </div>
        </div>
      </div>
    </main>
  );
}
