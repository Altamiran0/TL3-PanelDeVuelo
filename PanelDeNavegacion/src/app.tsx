import { AppHeader, InstrumentalPanel, DigitalPanel, CurrentMap } from "./components";
import { useAircraftData } from "./hooks"
import "./app.css"

export function App() {
  const { aircraftData, isLoading, error } = useAircraftData();

  if( isLoading ) return <div>Cargando datos...</div>;
  if( error ) return <div>{ error }</div>

  return (
    <>
    <AppHeader 
      isConnected= { aircraftData.isConnected }
      GPSmodule_isWork= { aircraftData.GPSmodule_isWork }/>

    <div className= "navigationDashboard" >
      <InstrumentalPanel 
        windSpeed={ aircraftData.windSpeed }
        verticalSpeed={ aircraftData.verticalSpeed }
        altitud={ aircraftData.altitud }
        pitchAngle={ aircraftData.pitchAngle }
        rollAngle={ aircraftData.rollAngle }/>

      <DigitalPanel 
        windSpeed={ aircraftData.windSpeed }
        verticalSpeed={ aircraftData.verticalSpeed }
        altitud={ aircraftData.altitud }
        pitchAngle={ aircraftData.pitchAngle }
        rollAngle={ aircraftData.rollAngle }/>

      <CurrentMap 
        lat={ aircraftData.lat }
        lng={ aircraftData.lng }/>
    </div>
    </>
  )
};
