'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ latitude, longitude }: { latitude: number; longitude: number }) {
  return (
    <MapContainer center={[latitude, longitude] as [number, number]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>Delivery Person Current Location</Popup>
      </Marker>
    </MapContainer>
  );
}
