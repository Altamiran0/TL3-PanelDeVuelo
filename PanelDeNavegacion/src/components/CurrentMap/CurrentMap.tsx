import { useRef, useEffect } from 'preact/hooks';
import L, { Map as LeafletMap } from 'leaflet';
import '../../services/leaflet-config';
import './CurrentMap.css';

function CurrentMap() {
   const mapRef = useRef< HTMLDivElement >( null );
   const leafletMapRef = useRef< LeafletMap >( null );

   const position = { lat: -34.7242, lng: -58.3506 }
   const zoom = 18;

   useEffect(() => {
    if ( !mapRef.current ) return;
    if ( !leafletMapRef.current ) {
      const map = L.map( mapRef.current, {
        zoomControl: false
      }).setView([ position.lat, position.lng ], zoom );
      L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' ).addTo( map );
      
      L.marker([ position.lat, position.lng ]).addTo( map );
      leafletMapRef.current = map;
    } else 
      leafletMapRef.current.setView([ position.lat, position.lng ], zoom);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.off('move');
      }
    };
  }, [position.lat, position.lng, zoom]);

   return (
   <div className={ "mapContainer" }>
      <div ref={ mapRef } className={ "map" }/>

      <span className="positionCard">
        <p>Latitud: { position.lat }º</p>
        <p>Longitud: { position.lng }º</p>
      </span>
   </div>
   );
};

export default CurrentMap;