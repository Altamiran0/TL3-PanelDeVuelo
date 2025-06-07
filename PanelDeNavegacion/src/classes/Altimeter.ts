import type { InstrumentalProps } from "../interfaces";
import { angARad } from "../services";

export class Altimeter {
   private ctx: CanvasRenderingContext2D;
   private radius = 135;
   private posX: number;
   private posY: number;
   private altitud = 0;
   // altitud: distancia vertical entre el nivel medio del mar y un punto en el aire.
   // altura: distancia vertical entre el terreno y un punto en el aire.
   // elevacion: distancia entre el nivel medio del mar y un punto en el terreno.

   constructor({ ctx, posX, posY }: InstrumentalProps) {
      this.ctx = ctx;
      this.posX = posX;
      this.posY = posY;
   };

   private drawStaticFrame() {
      const { ctx, radius, posX, posY } = this;      

      ctx.beginPath();
      ctx.arc( posX, posY, radius, 0, Math.PI * 2 );
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.beginPath();
      ctx.arc( posX, posY, (radius - 10 ), 0, Math.PI * 2 );
      ctx.fillStyle = '#151515';
      ctx.fill();  

      ctx.beginPath();
      ctx.arc( posX, posY, 50, 0, Math.PI * 2 );
      ctx.fillStyle = 'black';
      ctx.fill();
   };

   private drawGraduation() {
      const { ctx, radius, posX, posY } = this;

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2.5;

      const drawSmallBrand = ( angle: number ) => {
         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            posX + ( cos * ( radius - 16 ) ), 
            posY + ( sen * ( radius - 16 ) )
         );
         ctx.lineTo( 
            posX + ( cos * ( radius - 27 ) ), 
            posY + ( sen * ( radius - 27 ) )
         );
         ctx.stroke();
      };

      const drawMediumBrand = ( angle: number ) => {
         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            posX + ( cos * ( radius - 16 ) ), 
            posY + ( sen * ( radius - 16 ) )
         );
         ctx.lineTo( 
            posX + ( cos * ( radius - 32 ) ), 
            posY + ( sen * ( radius - 32 ) )
         );
         ctx.stroke();
      };

      const drawLargeBrand = ( angle: number ) => {
         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            posX + ( cos * ( radius - 16 ) ), 
            posY + ( sen * ( radius - 16 ) )
         );
         ctx.lineTo( 
            posX + ( cos * ( radius - 42 ) ), 
            posY + ( sen * ( radius - 42 ) )
         );
         ctx.stroke();
      };

      const brands = 50
      const majorStep = 5;
      const radRange = 360;
      const step = radRange / brands;

      for( let i = 0; i < brands; i++ ) {
         const isMajor = i % majorStep === 0;
         const brandAngle = step * i - 90;
         
         
         if(( i > 10 && i < 15 ))
            drawSmallBrand( brandAngle );
         else if( isMajor ) 
            drawLargeBrand( brandAngle );
         else
            drawMediumBrand( brandAngle );

      };
   };

   private drawNumbers() {      
      const { ctx, radius, posX, posY } = this;

      ctx.fillStyle = '#fff';
      ctx.font = '700 26px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const numbers = 10;
      const radRange = 360;
      const step = radRange / numbers;
      const textRadius = radius - 57;
      
      for (let i = 0; i < numbers; i++) {
         const brandAngle = ( step * i ) - 90;
         const angInRad = angARad( brandAngle );
         const cos = Math.cos( angInRad ), sin = Math.sin( angInRad );

         const x = posX + cos * textRadius;
         const y = posY + 1 + sin * textRadius;

         ctx.fillText( i.toString(), x, y );
      };
   };

   private drawNeedles() {
      const { ctx, radius, posX, posY, altitud } = this;

      if( altitud > 99 ) return;
      const firstDigit = altitud % 10;
      const secondDigit = ( altitud % 100 - firstDigit ) / 10;

      const rangeRad = angARad( 360 );
      const maxValue = 10;

      const drawLargeNeedle = () => {
         const valueAng = ( firstDigit / maxValue ) * rangeRad;

         ctx.save();
         ctx.translate( posX, posY );
         ctx.rotate( valueAng );

         ctx.fillStyle = '#e9e9e9'
         ctx.lineWidth = 4;
         ctx.beginPath();
         ctx.moveTo( 4, -15 );
         ctx.lineTo( 4, 55 - radius);
         ctx.lineTo( 0, 35 - radius);
         ctx.lineTo( -4, 55 - radius );
         ctx.lineTo( -4, -15  );
         ctx.stroke();

         ctx.fillStyle = '#333'
         ctx.beginPath();
         ctx.moveTo( 5, -15 );
         ctx.lineTo( 5, radius - 90 );
         ctx.arc( 0, radius - 90, 10, 0, angARad( 360 ));
         ctx.lineTo( -5, radius - 90 );
         ctx.lineTo( -5, -15 );
         ctx.fill();

         ctx.restore();
      };

      const drawShortNeedle = () => {
         const valueAng = ( secondDigit / maxValue ) * rangeRad;

         ctx.save();
         ctx.translate( posX, posY );
         ctx.rotate( valueAng );

         ctx.strokeStyle = '#d5d5d5';
         ctx.lineWidth = 4;
         ctx.beginPath();
         ctx.moveTo( 6, -10 );
         ctx.lineTo( 15, -40);
         ctx.lineTo( 0, -60);
         ctx.lineTo( -15, -40);
         ctx.lineTo( -6, -10);
         ctx.stroke();

         ctx.fillStyle = '#222'
         ctx.beginPath();
         ctx.moveTo( 6, -10 );
         ctx.lineTo( 6, 5);
         ctx.arc( 0, 0, 30, angARad( 62 ), angARad( 115 ));
         ctx.lineTo( -6, 5);
         ctx.lineTo( -6, -10);
         ctx.fill();

         ctx.restore();
      };

      drawShortNeedle();
      drawLargeNeedle();
   };

   private set setAltitud( altitud: number ) {
      this.altitud = altitud;
   };

   draw() {
      this.drawStaticFrame();
      this.drawGraduation();
      this.drawNumbers();
      this.drawNeedles();
   };

   updateAltimeter( altitud: number ){
      this.setAltitud = altitud;
      this.draw();
   };  
};

