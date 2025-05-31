import type { InstrumentalProps } from "../interfaces";
import { angARad } from "../services";

export class Anemometer {
   private ctx: CanvasRenderingContext2D;
   private radius = 135;
   private maxValue = 50;
   private posX: number;
   private posY: number;

   constructor({ ctx, posX, posY }: InstrumentalProps) {
      this.ctx = ctx;
      this.posX = posX;
      this.posY = posY;
   }

   drawBase() {
      const { ctx, radius, posX, posY } = this;
      const border = new Path2D();
      border.arc( posX, posY, radius, 0, Math.PI * 2 );
      ctx.fillStyle = '#000';
      ctx.fill( border );

      const background = new Path2D();
      background.arc( posX, posY, (radius - 10 ), 0, Math.PI * 2 );
      ctx.fillStyle = '#222';
      ctx.fill( background );
   };

   drawArcs() {
      const { ctx, radius, posX, posY } = this;
      const colors = [ '#e3dc1e', '#3ea30b', '#fff' ];
      const arcRadius = radius - 15;
      ctx.lineWidth = 10;

      const yellowArc = new Path2D();
      yellowArc.arc( posX, posY, arcRadius, angARad( 145 ), angARad( 225 ));
      ctx.strokeStyle = colors[ 0 ];
      ctx.stroke( yellowArc );

      const greenArc = new Path2D();
      greenArc.arc( posX, posY, arcRadius, angARad( 325 ), angARad( 145 ));
      ctx.strokeStyle = colors[ 1 ];
      ctx.stroke( greenArc );

      const whiteArc = new Path2D();
      whiteArc.arc( posX, posY, arcRadius - 5, angARad( 315 ), angARad( 45 ));
      ctx.lineWidth = 5;
      ctx.strokeStyle = colors[ 2 ];
      ctx.stroke( whiteArc );
   };

   drawGraduation() {
      const { ctx, radius, posX, posY } = this;

      const totalGrad = 38;
      const shortLen = 14;
      const longLen  = 20;

      const startRad = angARad( -80 );
      const endRad = angARad( 260 ); 
      const angleStep = ( endRad - startRad ) / totalGrad;

      const majorStep = 2;
      
      ctx.strokeStyle = '#fff';

      for (let i = 0; i <= totalGrad; i++) {
         const ang = startRad + angleStep * i;
         const cos = Math.cos( ang );
         const sin = Math.sin( ang );

         const rStart = radius - 10;
         const isMajor = ( i % majorStep ) === 0;
         ctx.lineWidth = isMajor ? 2 : 3;
         const rEnd   = rStart - ( isMajor ? shortLen : longLen );

         ctx.beginPath();
         ctx.moveTo(
            posX + cos * rStart,
            posY + sin * rStart
         );
         ctx.lineTo(
            posX + cos * rEnd,
            posY + sin * rEnd
         );
         ctx.stroke();
      }
   };

   drawNumbers() {      
      const { ctx, radius, maxValue, posX, posY } = this;
      const startRad = angARad(-70);
      const endRad = angARad(250);
      const count = 10;
      const step = ( endRad - startRad ) / ( count - 1 );  

      ctx.fillStyle = '#fff';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textRadius = radius - 45;

      for (let i = 0; i < count; i++) {
         const ang = startRad + step * i;
         const cos = Math.cos( ang );
         const sin = Math.sin( ang );

         const x = posX + cos * textRadius;
         const y = posY + sin * textRadius;

         const value = Math.round(( maxValue / count ) * ( i + 1 ));

         ctx.fillText( value.toString(), x, y );
      }
   };

   drawLegends() {
      const { ctx, posX, posY } = this;
      ctx.font = '14px';
      ctx.fillText( 'AIR SPEED', posX, posY - 35 );
      ctx.fillText( 'MPS', posX, posY + 35 );
   };
   
   drawNeedle( currentValue: number ) {
      const { ctx, radius, posX, posY } = this;
      const maxValue = 51.25;
      const scaleChangeValue = 5;
      let ang = 0;

      if( currentValue < scaleChangeValue ) {
         const effectiveValue = Math.max( 0, currentValue );

         const startDeg = -80;
         const endDeg = -70;
         const totalDeg = endDeg - startDeg;
   
         const valueRange = scaleChangeValue;
         const deg = startDeg + ( effectiveValue / valueRange ) * totalDeg;
         ang = angARad( deg );
      } else {
         const effectiveValue = Math.min( currentValue, maxValue );

         const startDeg = -70;
         const endDeg = 260;
         const totalDeg = endDeg - startDeg;
  
         const valueRange = maxValue - scaleChangeValue;
         const deg = startDeg + (( effectiveValue - scaleChangeValue ) / valueRange ) * totalDeg;
         ang = angARad( deg );
      }     
      
      const cos = Math.cos( ang ), sin = Math.sin( ang );
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 2;
      ctx.moveTo(posX, posY);
      ctx.lineTo(posX + cos * (radius - 30), posY + sin * (radius - 30));
      ctx.stroke();
   };

   drawStaticLayer() {
      this.drawBase();
      this.drawArcs();
      this.drawGraduation();
      this.drawNumbers();
      this.drawLegends();
   }

   updateValue( newValue: number ) {
      const { ctx, radius } = this;
      const diameter = radius * 2;
      ctx.clearRect( 0, 0, diameter, diameter );

      this.drawStaticLayer();
      this.drawNeedle( newValue );
   }

   draw() {
      this.drawStaticLayer();
      this.drawNeedle( 0 );
   }
}