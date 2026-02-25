import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ services }) => {
    // Default to Hyderabad center
    const center = [17.3850, 78.4867];

    // Mock coordinates for demo (randomize slightly around Hyderabad)
    const getPosition = (index) => {
        const lat = 17.3850 + (Math.random() - 0.5) * 0.1;
        const lng = 78.4867 + (Math.random() - 0.5) * 0.1;
        return [lat, lng];
    };

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {services.map((service, index) => (
                    <Marker key={service.service_id} position={getPosition(index)}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{service.service_name}</h3>
                                <p className="text-xs text-gray-600">{service.ServiceProvider?.sname}</p>
                                <p className="text-xs font-semibold text-blue-600">₹{service.price}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
