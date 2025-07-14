'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { SensorGroup, SensorData } from '@/types/sensor';
import { getGroupOverallStatus, getMarkerColor } from '@/utils/sensor-utils';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface MapWithPopupsProps {
    center?: [number, number];
    zoom?: number;
    sensorGroups?: SensorGroup[];
    onMarkerClick?: (groupId: string) => void;
}

const Map: React.FC<MapWithPopupsProps> = ({
    center = [41.1171, 16.8719],
    zoom = 10,
    sensorGroups = [],
    onMarkerClick,
}) => {
    const [isClient, setIsClient] = useState(false);
    const [L, setL] = useState<any>(null);

    useEffect(() => {
        // Only run on client side
        setIsClient(true);

        // Dynamically import Leaflet
        import('leaflet').then((leaflet) => {
            // Fix default icon issue
            delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
            leaflet.default.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            setL(leaflet.default);
        });
    }, []);

    // Don't render anything until we're on the client side
    if (!isClient || !L) {
        return (
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading map...
            </div>
        );
    }

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sensorGroups.map((group) => {
                if (!group.position) return null;

                const hasData = group.data !== null;
                const overallStatus = hasData ? getGroupOverallStatus(group.data as SensorData) : "normale";
                const markerColor = getMarkerColor(overallStatus);

                // Adjust marker size for mobile
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const markerSize = isMobile ? 40 : 32;
                const fontSize = isMobile ? 16 : 14;

                return (
                    <Marker
                        key={group.id}
                        position={group.position}
                        icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div style="background: ${markerColor}; color: white; border-radius: 50%; width: ${markerSize}px; height: ${markerSize}px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: ${fontSize}px; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.3);">${group.name.split(' ')[1] || group.name.charAt(0)}</div>`
                        })}
                        eventHandlers={{
                            click: () => {
                                if (onMarkerClick) {
                                    onMarkerClick(group.id);
                                }
                            },
                        }}
                    >
                        <Popup>
                            <div className="text-center min-w-[200px]">
                                <h3 className="font-bold text-lg mb-2">{group.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">Status: {overallStatus}</p>
                                {hasData && (
                                    <div className="space-y-1 text-sm">
                                        <p className="flex justify-between">
                                            <span>Temperatura:</span>
                                            <span className="font-semibold">{group.data?.temp}°C</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Umidità:</span>
                                            <span className="font-semibold">{group.data?.hum}%</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span>Suolo:</span>
                                            <span className="font-semibold">{group.data?.soil}%</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
