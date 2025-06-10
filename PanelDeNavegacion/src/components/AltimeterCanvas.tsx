import { useEffect, useRef } from "preact/hooks";
import { Altimeter } from "../classes";
import type { CanvasProp } from "../interfaces";

function AnemometerCanvas({ size, altitud = 0 }: CanvasProp) {
   const altitudCanvas = useRef< HTMLCanvasElement | null >(null);
   const altitudRef = useRef< Altimeter | null >(null);

   useEffect(() => {
      const canvas = altitudCanvas.current;
      if ( !canvas ) return;
      const ctx = canvas.getContext("2d");
      if ( !ctx ) return;

      altitudRef.current = new Altimeter({ ctx, size });
   }, []);

   useEffect(() => {
      if ( !altitudRef.current ) return;
      altitudRef.current.updateAltimeter( altitud );
   }, [ altitud ]);

   return (
      <canvas ref={ altitudCanvas } width={ size } height={ size }>
         Navegador no compatible con canvas.
      </canvas>
   );
};

export default AnemometerCanvas;