import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface CollegeMapProps {
  colleges: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
}

export const CollegeMap: React.FC<CollegeMapProps> = ({ colleges }) => {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {colleges.map((college, index) => (
        <Marker 
          key={index}
          position={[college.latitude, college.longitude]}
        >
          <Popup>{college.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
