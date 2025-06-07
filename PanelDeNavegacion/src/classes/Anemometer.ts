import type { InstrumentalProps } from "../interfaces";
import { angARad } from "../services";

export class Anemometer {
   private ctx: CanvasRenderingContext2D;
   private radius = 135;
   private posX: number;
   private posY: number;
   private speed = 0;

   constructor({ ctx, posX, posY }: InstrumentalProps) {
      this.ctx = ctx;
      this.posX = posX;
      this.posY = posY;
   }

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
   };

   private drawArcs() {
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

   private drawGraduation() {
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
      };
   };

   private drawNumbers() {      
      const { ctx, radius, posX, posY } = this;
      const maxValue = 50;
      const startRad = angARad(-70);
      const endRad = angARad(250);
      const count = 10;
      const step = ( endRad - startRad ) / ( count - 1 );  

      ctx.fillStyle = '#fff';
      ctx.font = '700 26px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textRadius = radius - 50;

      for (let i = 0; i < count; i++) {
         const ang = startRad + step * i;
         const cos = Math.cos( ang );
         const sin = Math.sin( ang );

         const x = posX + cos * textRadius;
         const y = posY + sin * textRadius;

         const value = Math.round(( maxValue / count ) * ( i + 1 ));

         ctx.fillText( value.toString(), x, y );
      };
   };

   private drawLegends() {
      const { ctx, posX, posY } = this;
      
      ctx.font = '16px system-ui';
      ctx.fillText( 'AIR SPEED', posX, posY - 30 );
      ctx.fillText( 'M/H', posX, posY + 30 );
   };
   
   private drawNeedle() {
      const { ctx, posX, posY, speed } = this;
      const maxValue = 51.25;
      const scaleChangeValue = 5;
      let valueAng = 0;

      if( speed < scaleChangeValue ) {
         const effectiveValue = Math.max( 0, speed );

         const startDeg = -80;
         const endDeg = -70;
         const totalDeg = endDeg - startDeg;
   
         const deg = startDeg + ( effectiveValue / scaleChangeValue ) * totalDeg;
         valueAng = angARad( deg );
      } else {
         const effectiveValue = Math.min( speed, maxValue );

         const startDeg = -70;
         const endDeg = 260;
         const totalDeg = endDeg - startDeg;
  
         const valueRange = maxValue - scaleChangeValue;
         const deg = startDeg + (( effectiveValue - scaleChangeValue ) / valueRange ) * totalDeg;
         valueAng = angARad( deg );
      };
      
      ctx.save();
      ctx.translate( posX, posY );
      ctx.rotate( valueAng );
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo( 4, 10 );
      ctx.lineTo( 100, 0 );
      ctx.lineTo( 5, -10 );
      ctx.lineTo( -20, 0 );
      ctx.closePath()
      ctx.stroke();

      ctx.restore();

   };

   public draw() {
      this.drawStaticFrame();
      this.drawArcs();
      this.drawGraduation();
      this.drawNumbers();
      this.drawLegends();
      this.drawNeedle();
   };

   private set setSpeed( speed: number ) {
      this.speed = speed;
   };

   public updateAnemometer( speed: number ) {
      this.setSpeed = speed;
      this.draw();
   };
}