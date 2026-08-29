import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Vehicle } from '@/lib/types';
import { getSocColor } from '@/lib/utils';

// Fix default icon paths for Leaflet in bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface FleetMapProps {
  vehicles: Vehicle[];
}

export default function FleetMap({ vehicles }: FleetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    vehicles.forEach((v) => {
      const lat = Number(v.lat);
      const lng = Number(v.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const soc = Number(v.soc) || 0;
      const color = getSocColor(soc);
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6,
      })
        .addTo(map)
        .bindPopup(
          `<div style="padding: 4px;">
            <strong style="color: ${color};">${v.name}</strong><br/>
            <span style="color: #aaa; font-size: 12px;">${v.plate}</span><br/>
            <span style="color: #ccc; font-size: 13px;">SoC: ${Math.round(v.soc)}% | Health: ${Math.round(v.health)}%</span><br/>
            <span style="color: #888; font-size: 12px;">${v.location_name} | ${v.status}</span>
          </div>`
        );

      marker.on('click', () => setSelectedVehicle(v));
      markersRef.current.push(marker);
    });
  }, [vehicles]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px] rounded-2xl overflow-hidden" />
      {selectedVehicle && (
        <div className="absolute bottom-4 left-4 z-[1000] glass-card px-4 py-3 max-w-xs">
          <p className="text-white font-bold text-sm">{selectedVehicle.name}</p>
          <p className="text-gray-400 text-xs">{selectedVehicle.plate} — {selectedVehicle.location_name}</p>
          <p className="text-gray-300 text-xs mt-1">SoC: {Math.round(selectedVehicle.soc)}% | Health: {Math.round(selectedVehicle.health)}% | {selectedVehicle.status}</p>
        </div>
      )}
    </div>
  );
}
