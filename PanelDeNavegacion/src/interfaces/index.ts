export interface InstrumentalProps {
   ctx: CanvasRenderingContext2D,
   posX: number,
   posY: number,
};

export interface CanvasProp {
   size: number,
   windSpeed?: number,
   rollAngle?: number,
   pitchAngle?: number,
   altitud?: number,
   verticalSpeed?: number
};

export interface CenterPoint {
   x: number,
   y: number
};

export interface ConstructorProps {
   ctx: CanvasRenderingContext2D,
   size: number
};