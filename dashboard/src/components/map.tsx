'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MarkerData {
    position: [number, number];
    popupText: string;
}

interface MapWithPopupsProps {
    center?: [number, number];
    zoom?: number;
    markers?: MarkerData[];
    onMarkerClick?: (popupText: string) => void;
}

const Map: React.FC<MapWithPopupsProps> = ({
    center = [41.1171, 16.8719],
    zoom = 13,
    markers = [
        { position: [41.1187, 16.852], popupText: '1' },
        { position: [41.120, 16.860], popupText: '2' },
        { position: [41.116, 16.860], popupText: '3' },
    ],
    onMarkerClick,
}) => {
    useEffect(() => {
        // Prevent SSR issues
        // Only needed if you're pre-rendering pages (Next.js SSR)
    }, []);

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, idx) => (
                <Marker
                    key={idx}
                    position={marker.position}
                    icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style=\"background: #2A93D5; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.3);\">${marker.popupText}</div>`
                    })}
                    eventHandlers={{
                        click: () => {
                            if (onMarkerClick) {
                                onMarkerClick(marker.popupText);
                            }
                        },
                    }}
                >
                    {/* <Popup></Popup> */}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
