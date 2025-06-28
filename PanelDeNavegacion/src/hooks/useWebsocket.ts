import { useEffect, useState } from "preact/hooks";
import type { NavData } from "../interfaces";
import { initialAircraftData } from "../services";

function useAircraftData() {
   const [ aircraftData, setAircraftData ] = useState< NavData >( initialAircraftData );
   const [ isLoading, setIsLoading ] = useState( false );
   const [ error, setError ] = useState("");

   useEffect(() => {
      setIsLoading( true );

      const webSocket = new WebSocket( `ws://${window.location.hostname}:81/` );

      webSocket.onopen = () => setIsLoading( false );

      webSocket.onmessage = ( e: MessageEvent ) => {
         try {
            const data = JSON.parse( e.data ) as NavData;

            if ( !data.GPSmodule_isWork && navigator.geolocation ) {
               navigator.geolocation.getCurrentPosition( 
                  pos => { 
                     setAircraftData({
                        ...data,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                     })
                  }, geoError => 
                     setError(`${ geoError.code }: ${ geoError.message }`)
               );
            } else setAircraftData( data );
         } catch( parceError ) { 
            if( parceError instanceof Error )
               setError( parceError.message );
            else
               setError( "Error al obtener datos" );
         }
      };

      webSocket.onerror = () => setError( "Error en la conexión con el Wemos - Reiniciar la pagina" );
      webSocket.onclose = () => setIsLoading( false );  

      return () => { webSocket.close() };
   }, []);
   
   return { aircraftData, isLoading, error };
};

export default useAircraftData;