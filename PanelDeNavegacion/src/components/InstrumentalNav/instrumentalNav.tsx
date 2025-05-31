import { useEffect } from "preact/hooks";
import { Anemometer, ArtHorizon } from "../../classes";
import "./InstrumentalNav.css"; 

function InstrumentalNav() {
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

      const artHorizon = new ArtHorizon({
         ctx,
         posX: ( radius * 3 ) + 5,
         posY: radius 
      });      
      artHorizon.draw();

      // const anemometer3 = new Anemometer({
      //    ctx,
      //    radius,
      //    posX: ( radius * 5 ) + 10,
      //    posY: radius 
      // });      
      // anemometer3.draw();

      // setInterval(() => {
      //    anemometer.updateValue( 30 );
      // }, 1000);
   }, []);

   return(
      <div>
         <canvas id="canvas" width="820" height="550" />
      </div>
   )
};

export default InstrumentalNav;