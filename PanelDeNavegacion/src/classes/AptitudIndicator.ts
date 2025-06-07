import type { InstrumentalProps } from "../interfaces";
import { angARad } from "../services";

type TickType = 'tickZero' | 'dot' | 'tickSmall' | 'tickLarge';

export class AptitudIndicator {
   private ctx: CanvasRenderingContext2D;
   private radius = 135;
   private gradient: CanvasGradient;
   private posX: number;
   private posY: number;
   private rollAngle = 0;
   private pitchAngle = 0;

   constructor({ ctx, posX, posY }: InstrumentalProps) {
      this.ctx = ctx;
      this.posX = posX;
      this.posY = posY;

      // Creo y guardo el gradiente.

      const { radius } = this; 

      const colors = [ '#2d6def', '#aa5a0b' ];      
      const gradient = ctx.createLinearGradient( 0, - radius, 0, radius );
      gradient.addColorStop( 0, colors[ 0 ] );
      gradient.addColorStop( 0.5, colors[ 0 ] );
      gradient.addColorStop( 0.5, colors[ 1 ] );
      gradient.addColorStop( 1, colors[ 1 ] );

      this.gradient = gradient;
   };

   private drawStaticBG() {
      const { ctx, radius, posX, posY } = this;
      const bgColor = '#2d6def';

      ctx.beginPath();
      ctx.arc( posX, posY, ( radius - 5 ), 0, Math.PI * 2 );
      ctx.fillStyle = bgColor;
      ctx.fill();
   };

   private drawStaticFrame() {
      const { ctx, radius, posX, posY } = this;

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 10;
      const border = new Path2D();
      border.arc( posX, posY, ( radius - 5 ), 0, Math.PI * 2 );
      ctx.stroke( border );

      ctx.fillStyle = 'black';
      ctx.lineWidth = 4;
      const base = new Path2D();
      base.arc( posX, posY, ( radius - 5 ), angARad( 40 ), angARad( 140 ));
      base.closePath();
      ctx.fill( base );

      ctx.strokeStyle = 'black';
      const plane = new Path2D();
      plane.arc( posX, posY, 15, angARad( 0 ), angARad( 180 ));
      ctx.stroke( plane );

      const wingPlane = new Path2D();
      wingPlane.moveTo( posX + 13, posY );
      wingPlane.lineTo( posX + 40, posY );
      wingPlane.moveTo( posX - 13, posY );
      wingPlane.lineTo( posX - 40, posY );
      ctx.stroke( wingPlane );
      
      const planeDot = new Path2D();
      ctx.fillStyle = 'black';
      planeDot.arc( posX, posY, 4, angARad( 0 ), angARad( 360 ));
      ctx.fill( planeDot );

      const triangle = new Path2D();
      ctx.strokeStyle = '#f48303';
      ctx.lineWidth = 4;
      triangle.moveTo( posX, 35 );
      triangle.lineTo( posX + 6, 55 );
      triangle.lineTo( posX - 6, 55 );
      triangle.closePath();
      ctx.stroke(triangle);
   };

   private drawRollIndicatorBase() {
      const { ctx, radius, gradient, posX, posY, rollAngle } = this;
      const newPosX = 0, newPosY = 0;
      const baseWidth = 30;

      ctx.save();

      ctx.translate( posX, posY );
      ctx.rotate( angARad( rollAngle ));
      ctx.strokeStyle = gradient;
      ctx.lineWidth = baseWidth;

      ctx.beginPath();
      ctx.arc( newPosX, newPosY, radius - 25, angARad( 0 ), angARad( 360 ));
      ctx.stroke();

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc( newPosX, newPosY, radius - 40, angARad( 0 ), angARad( 360 ));
      ctx.stroke();

      ctx.restore();
   };

   private drawRollIndicatorGraduation() {
      const { ctx, radius, posX, posY, rollAngle } = this;
      
      ctx.save();
      ctx.translate( posX, posY );
      ctx.rotate( angARad( rollAngle ));

      const graduations: { angle: number, type: TickType }[] = [
         { angle:   0,  type: 'tickZero' },
         { angle:  10,  type: 'tickSmall' },
         { angle:  20,  type: 'tickSmall' },
         { angle:  30,  type: 'tickLarge' },
         { angle:  45,  type: 'dot' },
         { angle:  60,  type: 'tickLarge' },
         { angle:  90,  type: 'tickLarge' }
      ];

      // const rollInd_graduation = new Path2D();
            
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';

      const getVector = ( angle: number ) => {
         const offsetAngle = 90;
         const angSup = angARad( - ( angle + offsetAngle ));
         const angInf = angARad( angle - offsetAngle );

         return {
            cosSup: Math.cos( angSup ),
            senSup: Math.sin( angSup ),
            cosInf: Math.cos( angInf ),
            senInf: Math.sin( angInf )
         }
      };

      const drawDot = ( X: number, Y: number ) => {
         ctx.beginPath();
         ctx.moveTo( X * ( radius - 26 ), Y * ( radius - 26 ));
         ctx.arc( X * ( radius - 26 ), Y * ( radius - 26 ), 7, 0, 2 * Math.PI );
         ctx.fill();
      };

      const drawTickSmall = ( X: number, Y: number ) => {
         ctx.beginPath();
         ctx.moveTo( X * ( radius - 15 ), Y * ( radius - 15 ));
         ctx.lineTo( X * ( radius - 30 ), Y * ( radius - 30 ));
         ctx.stroke();
      };

      const drawTickLarge = ( X: number, Y: number ) => {
         ctx.beginPath();
         ctx.moveTo( X * ( radius - 15 ), Y * ( radius - 15 ));
         ctx.lineTo( X * ( radius - 40 ), Y * ( radius - 40 ));
         ctx.stroke();
      };

      const drawTickZero = ( X: number, Y: number ) => {
         ctx.save();

         ctx.lineWidth = 5;            
         ctx.beginPath();
         ctx.moveTo( X * ( radius - 15 ), Y * ( radius - 15 ));
         ctx.lineTo( X * ( radius - 40 ), Y * ( radius - 40 ));
         ctx.stroke();

         ctx.restore();
      };

      const graduationsDrawers: Record< TickType, ( X: number, y: number ) => void > = {
         tickZero: drawTickZero,
         dot: drawDot,
         tickSmall: drawTickSmall,
         tickLarge: drawTickLarge,
      };

      graduations.forEach(({ angle, type }) => {
         ctx.lineWidth = 3;
         const { cosSup, senSup, cosInf, senInf } = getVector( angle );
         graduationsDrawers[ type ]?.( cosSup, senSup );
         graduationsDrawers[ type ]?.( cosInf, senInf );         
      });

      ctx.restore();
   };

   private drawRollIndicator() {
      this.drawRollIndicatorBase();
      this.drawRollIndicatorGraduation();
   };

   private drawPitchIndicatorBase() {
      const { ctx, radius, gradient, posX, posY, rollAngle, pitchAngle } = this;
      const newPosX = 0, newPosY = 0;

      ctx.save();
      ctx.translate( posX, posY );
      ctx.rotate( angARad( rollAngle ));
      ctx.translate( newPosX, pitchAngle * 2 );
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = 'black';

      ctx.beginPath();
      ctx.arc( newPosX, newPosY, radius - 40, angARad( 0 ), angARad( 360 ));
      ctx.fill();

      ctx.beginPath();
      ctx.arc( newPosX, newPosY, radius - 40, angARad( 0 ), angARad( 360 ));
      ctx.stroke();

      ctx.restore();
   };

   private drawPitchIndicatorGraduation() {
      const { ctx, radius, posX, posY, rollAngle, pitchAngle } = this;
      const newPosX = 0, newPosY = 0;

      ctx.save();
      ctx.translate( posX, posY );
      ctx.rotate( angARad( rollAngle ));      
      ctx.translate( newPosX, pitchAngle * 2 );
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo( newPosX - radius + 40, newPosY );
      ctx.lineTo( newPosX + radius - 40, newPosY );
      ctx.stroke();

      for( let i = 1; i < 5 ; i++ ) {
         const isPair = i % 2 == 0;

         if( isPair ) {
            ctx.beginPath();
            ctx.moveTo( newPosX - ( 9 * i ), newPosY - ( 10 * i ));
            ctx.lineTo( newPosX + ( 9 * i ), newPosY - ( 10 * i ));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo( newPosX - ( 9 * i ), newPosY + ( 10 * i ));
            ctx.lineTo( newPosX + ( 9 * i ), newPosY + ( 10 * i ));
            ctx.stroke();
         } else {
            ctx.beginPath();
            ctx.moveTo( newPosX - 7, newPosY - ( 10 * i ));
            ctx.lineTo( newPosX + 7, newPosY - ( 10 * i ));
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo( newPosX - 7, newPosY + ( 10 * i ));
            ctx.lineTo( newPosX + 7, newPosY + ( 10 * i ));
            ctx.stroke();
         }         
      };

      ctx.restore();
   };

   private drawPitchIndicator() {
      const { pitchAngle } = this;
      if( pitchAngle > 20 )
         this.pitchAngle = 20;
      if( pitchAngle < -20 )
         this.pitchAngle = -20;
      this.drawPitchIndicatorBase();
      this.drawPitchIndicatorGraduation();
   };

   public draw() {
      this.drawStaticBG();
      this.drawPitchIndicator();
      this.drawRollIndicator();
      this.drawStaticFrame();
   };

   private set setRollAngle( rollAngle: number ) {
      this.rollAngle = rollAngle;
   };

   private set setPitchAngle( pitchAngle: number ) {
      this.pitchAngle = pitchAngle;
   };

   public updateAptitudIndicator( rollAngle: number, pitchAngle: number ){
      this.setRollAngle = rollAngle;
      this.setPitchAngle = pitchAngle;

      this.draw();
   }   
};