import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import L for custom icon

// Fix for default Leaflet icon issue with bundlers like Vite/Webpack
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});
// --- End of fix ---

// Component to handle map clicks and marker placement
function LocationMarker({ position, onPositionChange }) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng); // Pass LatLng object directly
       map.flyTo(e.latlng, map.getZoom()); // Center map on click
    },
  });

  // Effect to center map when initialPosition changes (for editing)
  useEffect(() => {
    if (position) {
       map.flyTo(position, map.getZoom());
    }
  }, [position, map]);


  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function LocationPickerMap({ initialPosition, onLocationSelect }) {
  const [position, setPosition] = useState(initialPosition ? L.latLng(initialPosition.lat, initialPosition.lng) : null);
  const defaultCenter = [21.1702, 72.8311]; // Surat coordinates as default center

   // Update internal state if initialPosition prop changes (useful for edit forms)
  useEffect(() => {
    if (initialPosition && (position?.lat !== initialPosition.lat || position?.lng !== initialPosition.lng)) {
        setPosition(L.latLng(initialPosition.lat, initialPosition.lng));
    } else if (!initialPosition) {
        setPosition(null); // Clear position if initialPosition is removed
    }
  }, [initialPosition]);


  const handlePositionChange = (latlng) => {
    setPosition(latlng);
    onLocationSelect({ lat: latlng.lat, lng: latlng.lng }); // Pass simplified object
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Select Venue Location on Map*
      </label>
      <MapContainer
        center={position || defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0' }}
      >
        <TileLayer
          attribution='© <a href="http://googleusercontent.com/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onPositionChange={handlePositionChange} />
      </MapContainer>
       {position && (
        <p className="text-xs text-slate-500 mt-2">
          Selected: Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
        </p>
      )}
      {!position && (
        <p className="text-xs text-slate-500 mt-2">Click on the map to set the venue location.</p>
      )}
    </div>
  );
}

export default LocationPickerMap;