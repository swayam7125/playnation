import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'; // Import icons

// Fix for default Leaflet icon issue
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

function VenueLocationMap({ lat, lng, venueName, venueAddress }) { // Added venueAddress prop
  // Validate latitude and longitude
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return <p className="text-slate-500 mt-4">Location map not available for this venue.</p>;
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid lat/lng provided to VenueLocationMap:", lat, lng);
      return <p className="text-red-500 mt-4">Error displaying map: Invalid location data.</p>;
  }

  const position = [latitude, longitude];

  // Construct Google Maps URL using coordinates
  // This URL structure opens Google Maps centered on the coordinates.
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  // Alternative URL that tries to place a pin (might be better):
  // const googleMapsUrl = `https://www.google.com/maps?q=LATITUDE,LONGITUDE`

  return (
     <div className="mt-6">
          <h3 className="text-lg font-semibold text-dark-text mb-3 flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary-green"/> Location
          </h3>
          {/* Display Map */}
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false} // Keep interaction simple
            style={{ height: '300px', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', zIndex: 0 }}
          >
            <TileLayer
              attribution='© <a href="http://googleusercontent.com/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
               <b>{venueName || 'Venue Location'}</b> <br />
                {venueAddress && <span>{venueAddress}<br /></span>}
                <a
                  href={googleMapsUrl} // Use the generated URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-green hover:underline font-medium inline-flex items-center gap-1"
                 >
                  View on Google Maps <FaExternalLinkAlt size="0.7em"/>
                 </a>
              </Popup>
            </Marker>
          </MapContainer>

           {/* Direct Link Below Map */}
           <div className="mt-3 text-center sm:text-left">
                <a
                  href={googleMapsUrl} // Use the same generated URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm"
                 >
                  <FaMapMarkerAlt />
                  Get Directions on Google Maps
                  <FaExternalLinkAlt size="0.8em" className="opacity-70"/>
                 </a>
           </div>
     </div>
  );
}

export default VenueLocationMap;