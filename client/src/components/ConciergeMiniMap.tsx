import { useEffect } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import {
  CHARTRONS_BOUNDING_BOX,
  CHARTRONS_MAP_CENTER,
  type ConciergeRecommendation,
  type GeoCoordinates,
} from '@idea-chartrons/shared';
import { useUserLocation } from '../context/UserLocationContext';

function pinIcon(selected: boolean) {
  const size = selected ? 36 : 28;
  return L.divIcon({
    className: 'chartrons-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `<div style="width:${size}px;height:${size}px;border-radius:${size / 2}px ${size / 2}px ${size / 2}px 6px;transform:rotate(-45deg);background:#1F4D3A;border:2px solid #fff"></div>`,
  });
}

function FitPins({ pins, origin }: { pins: ConciergeRecommendation[]; origin: GeoCoordinates }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const points: [number, number][] = [
      ...pins.map((pin): [number, number] => [pin.coordinates.lat, pin.coordinates.lng]),
      [origin.latitude, origin.longitude],
    ];
    if (points.length === 1) {
      map.setView(points[0], 16);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 });
  }, [map, pins, origin]);
  return null;
}

interface ConciergeMiniMapProps {
  recommendations: ConciergeRecommendation[];
}

export function ConciergeMiniMap({ recommendations }: ConciergeMiniMapProps) {
  const { t } = useTranslation();
  const { origin, originSource } = useUserLocation();

  if (recommendations.length === 0) return null;

  const isGps = originSource === 'gps';

  return (
    <MapContainer
      center={[CHARTRONS_MAP_CENTER.latitude, CHARTRONS_MAP_CENTER.longitude]}
      zoom={15}
      minZoom={14}
      maxBounds={[
        [CHARTRONS_BOUNDING_BOX.sw.lat, CHARTRONS_BOUNDING_BOX.sw.lng],
        [CHARTRONS_BOUNDING_BOX.ne.lat, CHARTRONS_BOUNDING_BOX.ne.lng],
      ]}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitPins pins={recommendations} origin={origin} />
      {recommendations.map((item, index) => (
        <Marker
          key={item.poiId}
          position={[item.coordinates.lat, item.coordinates.lng]}
          icon={pinIcon(index === 0)}
        >
          <Popup>
            <p className="font-semibold text-sm m-0">{item.name}</p>
            <p className="text-xs m-0 mt-1">{item.address}</p>
          </Popup>
        </Marker>
      ))}
      <CircleMarker
        center={[origin.latitude, origin.longitude]}
        radius={9}
        pathOptions={{
          color: '#fff',
          weight: 2,
          fillColor: '#1F4D3A',
          fillOpacity: isGps ? 1 : 0.4,
        }}
      >
        <Popup>
          <p className="text-xs font-semibold m-0">{t(isGps ? 'geo.youAreHere' : 'geo.approxCenter')}</p>
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
}
