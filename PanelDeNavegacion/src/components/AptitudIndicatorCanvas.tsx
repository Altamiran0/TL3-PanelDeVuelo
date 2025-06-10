import { useEffect, useRef } from "preact/hooks";
import { AptitudIndicator } from "../classes";
import type { CanvasProp } from "../interfaces";

function AptitudIndicatorCanvas({ size,  rollAngle = 0, pitchAngle = 0 }: CanvasProp ) {
   const aptitudIndicatorCanvas = useRef< HTMLCanvasElement | null >(null);
   const aptitudIndicatorRef = useRef< AptitudIndicator | null >(null);

   useEffect(() => {
      const canvas = aptitudIndicatorCanvas.current;
      if ( !canvas ) return;
   
      const ctx = canvas.getContext("2d");
      if ( !ctx ) return;
   
      aptitudIndicatorRef.current = new AptitudIndicator({ ctx, size });
   }, []);

   useEffect(() => {
      if ( !aptitudIndicatorRef.current ) return;
      aptitudIndicatorRef.current.updateAptitudIndicator( rollAngle, pitchAngle );
   }, [ rollAngle, pitchAngle ]);

   return(
      <canvas ref={ aptitudIndicatorCanvas } width={ size } height={ size } >
         Navegador no compatible con canvas.
      </canvas>
   );
};

export default AptitudIndicatorCanvas;