import { 
  AnemometerCanvas, 
  AptitudIndicatorCanvas, 
  AltimeterCanvas, 
  VerticalSpeedIndicatorCanvas 
} from "../";
import "./InstrumentalPanel.css";

interface Props {
  windSpeed: number,
  pitchAngle: number,
  rollAngle: number,
  altitud: number,
  verticalSpeed: number
}

function InstrumentalPanel({ windSpeed, pitchAngle, rollAngle, altitud, verticalSpeed }: Props) {
  return (
    <>
    <div className={ 'InstrumentalPanel' }>
      <AnemometerCanvas 
        size={ 250 } windSpeed={ windSpeed } />
      <AptitudIndicatorCanvas 
        size={ 250 } pitchAngle={ pitchAngle } rollAngle={ rollAngle } />
      <AltimeterCanvas 
        size={ 250 } altitud={ altitud } />
      <VerticalSpeedIndicatorCanvas 
        size={ 250 } verticalSpeed={ verticalSpeed } />
    </div>
    </>
  )
};

export default InstrumentalPanel;