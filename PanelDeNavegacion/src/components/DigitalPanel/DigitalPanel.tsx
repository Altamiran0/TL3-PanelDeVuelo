import "./DigitalPanel.css";

function DigitalPanel() {
   return (
   <div className={ 'panel' }>
      <h3 className={ 'title' }>Datos de Navegacion</h3>
      <ul className={ 'frame' }>
         <li className={ 'item' }>
            <p>Velocidad</p> <span>50km/h</span>
         </li>
         <li className={ 'item' }>
            <p>Angulo de cabeceo</p> <span>40º</span>
         </li>
         <li className={ 'item' }>
            <p>Angulo de alabeo</p> <span>90º</span>
         </li>
         <li className={ 'item' }>
            <p>Altitud</p> <span>10m</span>
         </li>
         <li className={ 'item lastItem' }>
            <p>Velocidad vertical</p> <span>5km/h</span>
         </li>
      </ul>
   </div>
   )
};

export default DigitalPanel;