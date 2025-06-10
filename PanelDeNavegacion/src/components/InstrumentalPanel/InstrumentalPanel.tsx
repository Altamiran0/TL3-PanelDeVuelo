import { 
  AnemometerCanvas, 
  AptitudIndicatorCanvas, 
  AltimeterCanvas, 
  VerticalSpeedIndicatorCanvas 
} from "../";
import './InstrumentalPanel.css'

function InstrumentalPanel() {
  return (
    <>
    <div className={ 'InstrumentalPanel' }>
      <AnemometerCanvas size={ 275 } windSpeed={ 0 } />
      <AptitudIndicatorCanvas size={ 275 } pitchAngle={ 0 } rollAngle={ 0 } />
      <AltimeterCanvas size={ 275 } altitud={ 0 } />
      <VerticalSpeedIndicatorCanvas size={ 275 } verticalSpeed={ 0 } />
    </div>
    </>
  )
};

export default InstrumentalPanel;