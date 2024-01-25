import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
// import axios from "axios";

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2VhdGhlcnBsdXMiLCJhIjoiY2twZXc0NzRhMGU5YjJ2cDM4bzZuY2FodCJ9.hFHDVQZXv0UwPavktkyp8Q';

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(105.9283);
  const [lat, setLat] = useState(21.0430);
  const [zoom, setZoom] = useState(9.34);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
      projection: 'mercator'
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on('load', () => {
      map.setFog({});
      map.addSource('borough-boundaries',
          {
            type:'geojson',
            data:'newfile.geojson'
          })
      map.addLayer({
        id:'borough-boundaries-fill',
        type: 'fill',
        source:'borough-boundaries',
        paint:{
          'fill-color':'orange'
        }
      })
    })
    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect( () => {
    async function fetchData () {
      const response = await fetch('./mapbox-boundaries-adm1-v4_1.csv', {method: 'GET'});
      console.log("data boundaries v1 :", response.text())
    }
    fetchData();
  },[])

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;
