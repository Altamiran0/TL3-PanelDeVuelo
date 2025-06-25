import { 
  AnemometerCanvas, 
  AptitudIndicatorCanvas, 
  AltimeterCanvas, 
  VerticalSpeedIndicatorCanvas 
} from "../";
import "./InstrumentalPanel.css";

function InstrumentalPanel() {
  return (
    <>
    <div className={ 'InstrumentalPanel' }>
      <AnemometerCanvas size={ 250 } windSpeed={ 0 } />
      <AptitudIndicatorCanvas size={ 250 } pitchAngle={ 0 } rollAngle={ 0 } />
      <AltimeterCanvas size={ 250 } altitud={ 0 } />
      <VerticalSpeedIndicatorCanvas size={ 250 } verticalSpeed={ 0 } />
    </div>
    </>
  )
};

export default InstrumentalPanel;