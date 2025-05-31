import type { InstrumentalProps } from "../interfaces";
import { angARad } from "../services";

export class ArtHorizon {
   private ctx: CanvasRenderingContext2D;
   private radius = 135;
   private posX: number;
   private posY: number;

   constructor({ ctx, posX, posY }: InstrumentalProps) {
      this.ctx = ctx;
      this.posX = posX;
      this.posY = posY;
   }

   drawStaticBase() {
      const { ctx, radius, posX, posY } = this;
      const borderColor = 'rgb( 0, 0, 0 )';
      const planeColor = 'rgb(0, 0, 0)';
      const triangleColor = 'rgb(255, 0, 0)';

      const border = new Path2D();
      border.arc( posX, posY, ( radius - 5 ), 0, Math.PI * 2 );
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 10;
      ctx.stroke( border );

      const base = new Path2D();
      ctx.fillStyle = borderColor;
      ctx.lineWidth = 4;
      base.arc( posX, posY, ( radius - 5 ), angARad( 40 ), angARad( 140 ));
      base.closePath();
      ctx.fill( base );

      const plane = new Path2D();
      ctx.strokeStyle = planeColor;
      plane.arc( posX, posY, 15, angARad( 0 ), angARad( 180 ));
      plane.moveTo( posX + 13, posY );
      plane.lineTo( posX + 40, posY );
      plane.moveTo( posX - 13, posY );
      plane.lineTo( posX - 40, posY );
      ctx.stroke( plane );
      
      const planeDot = new Path2D();
      ctx.fillStyle = planeColor;
      planeDot.arc( posX, posY, 4, angARad( 0 ), angARad( 360 ));
      ctx.fill( planeDot );

      const triangle = new Path2D();
      ctx.fillStyle = triangleColor;
      triangle.moveTo( posX, 30 );
      triangle.lineTo( posX - 10, 55 );
      triangle.lineTo( posX + 10, 55 );
      triangle.closePath();
      ctx.fill(triangle);
   };

   drawRollInd( rollAngle: number ) {
      const { ctx, radius, posX, posY } = this;
      const newPosX = 0, newPosY = 0;
      const baseSize = 30;
      
      const colors = [ '#2d6def', '#aa5a0b' ];      
      const gradient = ctx.createLinearGradient( newPosX, newPosY - radius, 0, newPosY + radius );
      gradient.addColorStop( 0, colors[ 0 ] );
      gradient.addColorStop( 0.5, colors[ 0 ] );
      gradient.addColorStop( 0.5, colors[ 1 ] );
      ctx.strokeStyle = gradient;
      ctx.lineWidth = baseSize;
      
      ctx.save();
      ctx.translate( posX, posY );
      ctx.rotate( angARad( rollAngle ));

      const rollInd_base = new Path2D();
      rollInd_base.arc( newPosX, newPosY, radius - 25, angARad( 0 ), angARad( 360 ));
      ctx.stroke( rollInd_base );

      const rollInd_graduation = new Path2D();
      const graduations = [ 0, 10, 20, 30, 45, 60, 90 ]; 
      ctx.lineWidth = 3;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      for (let index = 0; index < graduations.length; index++) {
         const ang = angARad( graduations[ index ] - 90 );
         const cos_1 = Math.cos( ang ), sen_1 = Math.sin( ang );

         ctx.lineWidth = 3;

         if ( graduations[ index ] === 0 ) {
            ctx.lineWidth = 5;            
            rollInd_graduation.moveTo( cos_1 * ( radius - 15 ), sen_1 * ( radius - 15 ));
            rollInd_graduation.lineTo( cos_1 * ( radius - 40 ), sen_1 * ( radius - 40 ));
            ctx.stroke( rollInd_graduation );
         }     

         if( graduations[ index ] === 45 ) {
            rollInd_graduation.moveTo( cos_1 * ( radius - 25 ), sen_1 * ( radius - 25 ));
            rollInd_graduation.arc( cos_1 * ( radius - 25 ), sen_1 * ( radius - 25 ), 5, 0, 2 * Math.PI );
            ctx.fill( rollInd_graduation );
         }

         if ( graduations[ index ] === 10 || graduations[ index ] === 20 ) {
            rollInd_graduation.moveTo( cos_1 * ( radius - 15 ), sen_1 * ( radius - 15 ));
            rollInd_graduation.lineTo( cos_1 * ( radius - 30 ), sen_1 * ( radius - 30 ));
            ctx.stroke( rollInd_graduation );
         } else {
            rollInd_graduation.moveTo( cos_1 * ( radius - 15 ), sen_1 * ( radius - 15 ));
            rollInd_graduation.lineTo( cos_1 * ( radius - 40 ), sen_1 * ( radius - 40 ));
            ctx.stroke( rollInd_graduation );
         }
      }
      ctx.restore();
   };

   draw() {
      this.drawRollInd( 0 );
      this.drawStaticBase();
      
      // const graduations = [ 10, 20, 30, 45, 60, 90 ]; 
      // let index = 0;

      // setInterval(() => {
      //    this.drawRollInd( - graduations[ index ] );
      //    this.drawStaticBase();
      //    index++;
      // }, 100);
   };
};