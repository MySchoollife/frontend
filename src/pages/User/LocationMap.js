import React, { useState, useEffect } from 'react';
import { Input } from "antd";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'; 
import { useAppContext } from '../../context/AppContext';
const libraries = ["drawing", "places"];

const LocationMap = ({ onChange, userData ,editLocation}) => {

  const [userAddress, setUserAddress]   =   useState(null);
  const [map, setMap]                   =   useState(null);
  const {country} = useAppContext()
  const [coordinates, setCoordinates]   =   useState({ lat: 30.5595, lng: 22.9375 });

  const handleLocationSelect = async (selectedAddress) => {
    try {
      const results       =   await geocodeByAddress(selectedAddress);
      const { lat, lng }  =   await getLatLng(results[0]);
      setCoordinates({ lat, lng });
      setUserAddress(selectedAddress);
      if(onChange){
        onChange({ map_address: selectedAddress, latitude: lat, longitude: lng });
      }
    } catch (error) {
      console.error('Error while selecting location:', error);
    }
  };

  const geocodeByLatLng = async (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error('Geocoder request failed.'));
        }
      });
    });
  };

  const handleMarkerDrag = async (event) => {
    try {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();
      setCoordinates({ lat, lng });
      const results = await geocodeByLatLng(lat, lng);
      if (results.length > 0) {
        const selectedAddress = results;
        setUserAddress(selectedAddress);
        if (onChange) {
          onChange({ map_address: selectedAddress, latitude: lat, longitude: lng });
        }
      }
    } catch (error) {
      console.error('Error while dragging marker:', error);
    }
  }; 

  useEffect(()=>{
    if(!country.data) return 

    setCoordinates({ lat: country.data.latitude, lng: country.data.longitude })
  },[country])

  useEffect(() => {
    console.log(editLocation,'editLocation');
    if (editLocation) {
      setUserAddress(editLocation.map_address);
      setCoordinates({ ...coordinates, lat: parseFloat(editLocation.latitude), lng: parseFloat(editLocation.longitude) });
    }else{
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCoordinates({ lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) });
        });
      }
    }
  }, [editLocation]);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: 'AIzaSyDQ2DCe8qS4qVCkMtRZRnZZ_TF2qq1HSvs', libraries });

  if (!isLoaded) {
    return <div className='text-center'>Loading Map</div>
  }

  return (
    <>
      <PlacesAutocomplete value={userAddress} onChange={setUserAddress} onSelect={handleLocationSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <Input {...getInputProps({placeholder: 'Search Location'})} />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Please Wait...</div>}

              {suggestions.map((suggestion) => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                const style     = suggestion.active ? { backgroundColor: '#fafafa', cursor: 'pointer' } : { backgroundColor: '#ffffff', cursor: 'pointer' };
                
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}> <span>{suggestion.description}</span> </div>
                );

              })}
            </div>
          </>
        )}
      </PlacesAutocomplete>
      
      <GoogleMap center={coordinates} zoom={7} mapContainerClassName="googleMap" onLoad={(map) => setMap(map)}>
        <Marker position={coordinates} draggable={true} onDragEnd={handleMarkerDrag} />
      </GoogleMap>

    </>
  );
}

export default LocationMap;
