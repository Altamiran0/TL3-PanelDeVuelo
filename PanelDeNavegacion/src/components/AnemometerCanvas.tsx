import { useEffect, useRef } from "preact/hooks";
import { Anemometer } from "../classes";
import type { CanvasProp } from "../interfaces";

function AnemometerCanvas({ size, windSpeed = 0 }: CanvasProp) {
   const anemometerCanvas = useRef< HTMLCanvasElement | null >(null);
   const anemometerRef = useRef< Anemometer | null >(null);

   useEffect(() => {
      const canvas = anemometerCanvas.current;
      if ( !canvas ) return;

      const ctx = canvas.getContext("2d");
      if ( !ctx ) return;

      anemometerRef.current = new Anemometer({ ctx, size });
   }, []);

   useEffect(() => {
      if ( !anemometerRef.current ) return;
      anemometerRef.current.updateAnemometer( windSpeed );
   }, [ windSpeed ]);

   return (
      <canvas ref={ anemometerCanvas } width={ size } height={ size }>
         Navegador no compatible con canvas.
      </canvas>
   );
};

export default AnemometerCanvas;