import { useEffect } from "preact/hooks";
import { Anemometer, AptitudIndicator, Altimeter } from "../../classes";
import "./InstrumentalNav.css"; 

function InstrumentalNav() {
   /* 
      Posibles mejoras:
         Perilla de ajuste de HA.
         Perilla de ajuste de presion referencial Altimetro.
         Un gradiente para darle profundidad al circulo central del HA.
         Bandera de los 10k para el altimetro.
         Darle profundidad a los instrumentos.
   */

   useEffect(() => {
      const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
      if( !canvas ) return;
      const ctx = canvas.getContext('2d');
      if( !ctx ) return;      
      
      ctx.clearRect( 0, 0, canvas.width, canvas.height );
      const radius = 135;

      const anemometer = new Anemometer({
         ctx,
         posX: radius,
         posY: radius
      });      
      anemometer.draw();

      const aptitudIndicator = new AptitudIndicator({
         ctx,
         posX: ( radius * 3 ) + 5,
         posY: radius 
      });      
      aptitudIndicator.draw();

      const altimeter = new Altimeter({
         ctx,
         posX: ( radius * 5 ) + 10,
         posY: radius 
      });      
      altimeter.draw();
   }, []);

   return(
      <div>
         <canvas id="canvas" width="820" height="550" />
      </div>
   )
};

export default InstrumentalNav;