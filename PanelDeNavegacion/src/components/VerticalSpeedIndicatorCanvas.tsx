import { useEffect, useRef } from "preact/hooks";
import { VerticalSpeedIndicator } from "../classes";
import type { CanvasProp } from "../interfaces";

function VerticalSpeedIndicatorCanvas({ size, verticalSpeed = 0 }: CanvasProp) {
   const verticalSpeedCanvas = useRef< HTMLCanvasElement | null >(null);
   const verticalSpeedRef = useRef< VerticalSpeedIndicator | null >(null);

   useEffect(() => {
      const canvas = verticalSpeedCanvas.current;
      if ( !canvas ) return;

      const ctx = canvas.getContext("2d");
      if ( !ctx ) return;

      verticalSpeedRef.current = new VerticalSpeedIndicator({ ctx, size });
   }, []);

   useEffect(() => {
      if ( !verticalSpeedRef.current ) return;
      verticalSpeedRef.current.updateVerticalSpeedIndicator( verticalSpeed );
   }, [ verticalSpeed ]);

   return (
      <canvas ref={ verticalSpeedCanvas } width={ size } height={ size }>
         Navegador no compatible con canvas.
      </canvas>
   );
};

export default VerticalSpeedIndicatorCanvas;