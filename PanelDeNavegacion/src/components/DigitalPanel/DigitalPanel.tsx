import "./DigitalPanel.css";

interface Props {
  windSpeed: number,
  pitchAngle: number,
  rollAngle: number,
  altitud: number,
  verticalSpeed: number
}

function DigitalPanel({ windSpeed, pitchAngle, rollAngle, altitud, verticalSpeed }: Props) {
   return (
   <div className={ 'panel' }>
      <h3 className={ 'title' }>Datos de Navegacion</h3>
      <ul className={ 'frame' }>
         <li className={ 'item' }>
            <p>Velocidad</p> <span>{ windSpeed } km/h</span>
         </li>
         <li className={ 'item' }>
            <p>Velocidad vertical</p> <span>{ verticalSpeed } km/h</span>
         </li>
         <li className={ 'item' }>
            <p>Altitud</p> <span>{ altitud } m</span>
         </li>
         <li className={ 'item' }>
            <p>Angulo de cabeceo</p> <span>{ pitchAngle } º</span>
         </li>
         <li className={ 'item lastItem' }>
            <p>Angulo de alabeo</p> <span>{ rollAngle } º</span>
         </li>
      </ul>
   </div>
   )
};

export default DigitalPanel;