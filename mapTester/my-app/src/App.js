import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Your Google Maps API key
const googleMapsApiKey = 'AIzaSyDrl5HtC_bvZ1Df3Tb5lCrhS6-DHE5PbR4';

const App = () => {
  const [pins, setPins] = useState([]); // To store pin positions and descriptions
  const [selectedPin, setSelectedPin] = useState(null); // To store selected pin for InfoWindow
  const mapRef = useRef(null); // Ref to store the map instance

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 33.776, // Default latitude (San Francisco)
    lng: -84.399, // Default longitude (San Francisco)
  };

  const onMapClick = (event) => {
    // Prompt the user for a description
    const description = prompt("Enter a description for this pin:");
    const building = prompt("What building is this in.");
    if (description) {
      // Add the new pin to the state
      setPins([
        ...pins,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          description: description,
          building: building,
        },
      ]);
    }
  };

  const handleMarkerClick = (pin) => {
    // Set the selected pin for the InfoWindow
    setSelectedPin(pin);
  };

  const handleCloseInfoWindow = () => {
    setSelectedPin(null); // Close the InfoWindow
  };

  const deletePin = (pinToDelete) => {
    setPins(pins.filter(pin => pin !== pinToDelete));
  };

  // Initialize the MarkerClusterer when the map is loaded
  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (mapRef.current && pins.length > 0) {
      const markers = pins.map((pin, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: mapRef.current,
        });

        marker.addListener('click', () => handleMarkerClick(pin));

        return marker;
      });

      new MarkerClusterer({ map: mapRef.current, markers });
    }
  }, [pins]);

  return (
    <div className="App">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onClick={onMapClick} // Handle map click to place a pin
          onLoad={onLoad} // Initialize the map
        >
          {/* Render markers for each pin */}
          {pins.map((pin, index) => (
            <Marker
              key={index}
              position={{ lat: pin.lat, lng: pin.lng }}
              onClick={() => handleMarkerClick(pin)} // Set the clicked pin
            >
              {selectedPin === pin && (
                <InfoWindow onCloseClick={handleCloseInfoWindow}>
                  <div>
                    <h3>Pin Description</h3>
                    <p>{pin.description}</p>
                    <h3>Building Location</h3>
                    <p>{pin.building}</p>
                    <button onClick={() => deletePin(pin)}>Resolve</button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
      <h1>List of Items</h1>
    </div>
  );
};

export default App;