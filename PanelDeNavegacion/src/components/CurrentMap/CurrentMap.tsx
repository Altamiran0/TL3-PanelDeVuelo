import { useRef, useEffect } from 'preact/hooks';
import L, { Map as LeafletMap, Marker } from 'leaflet';
import '../../services/leaflet-config';
import './CurrentMap.css';

interface Props { lat: number, lng: number }

function CurrentMap({ lat, lng }: Props) {
   const mapRef = useRef< HTMLDivElement >( null );
   const leafletMapRef = useRef< LeafletMap >( null );
   const markerRef = useRef< Marker|null >( null );
   const zoom = 18;

   useEffect(() => {
    if ( !mapRef.current ) return;

    if ( !leafletMapRef.current ) {
      const map = L.map( mapRef.current, { zoomControl: false }).setView([ lat, lng ], zoom );
      L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' ).addTo( map );
      
      const marker = L.marker([ lat, lng ]).addTo( map );
      leafletMapRef.current = map;
      markerRef.current = marker;
    } else {
      leafletMapRef.current.setView([ lat, lng ], zoom);
      markerRef.current?.setLatLng([lat, lng]);
    }

    return () => {
      if ( leafletMapRef.current ) 
        leafletMapRef.current.off('move');
    };
  }, [ lat, lng ]);

   return (
   <div className={ "mapContainer" }>
      <div ref={ mapRef } className={ "map" }/>

      <span className="positionCard">
        <p>Latitud: { lat }º</p>
        <p>Longitud: { lng }º</p>
      </span>
   </div>
   );
};

export default CurrentMap;