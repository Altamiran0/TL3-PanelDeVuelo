import type { CenterPoint, ConstructorProps } from "../interfaces";
import { angARad, colors } from "../services";

type TickType = 'tickZero' | 'dot' | 'tickSmall' | 'tickLarge';

export class AptitudIndicator {
   private ctx: CanvasRenderingContext2D;
   private radius: number;
   private center: CenterPoint;

   private gradient: CanvasGradient;
   private rollAngle = 0;
   private pitchAngle = 0;

   constructor({ ctx, size }: ConstructorProps) {
      this.ctx = ctx;
      this.radius = size / 2;
      this.center = {
         x: this.radius,
         y: this.radius
      };

      const gradient = ctx.createLinearGradient( 0, - this.radius, 0, this.radius );
      gradient.addColorStop( 0, colors.sky );
      gradient.addColorStop( 0.5, colors.sky );
      gradient.addColorStop( 0.5, colors.ground );
      gradient.addColorStop( 1, colors.ground );

      this.gradient = gradient;
   };

   private drawStaticBG() {
      const { ctx, radius, center } = this;

      ctx.beginPath();
      ctx.arc( center.x, center.y, radius - 2, 0, Math.PI * 2 );
      ctx.fillStyle = colors.sky;
      ctx.fill();
   };

   private drawStaticFrame() {
      const { ctx, radius, center } = this;

      ctx.strokeStyle = colors.border;
      ctx.fillStyle = colors.border;

      ctx.lineWidth = radius * 0.12;
      const border = new Path2D();
      border.arc( center.x, center.y, ( radius * 0.94), 0, Math.PI * 2 );
      ctx.stroke( border );

      ctx.lineWidth = radius * 0.03;
      const base = new Path2D();
      base.arc( center.x, center.y, radius, angARad( 35 ), angARad( 145 ));
      base.closePath();
      ctx.fill( base );

      const plane = new Path2D();
      plane.arc( center.x, center.y, ( radius * 0.12 ), angARad( 0 ), angARad( 180 ));
      ctx.stroke( plane );

      ctx.strokeStyle = colors.plane;
      ctx.fillStyle = colors.plane;

      const wingPlane = new Path2D();
      wingPlane.moveTo( center.x + 13, center.y );
      wingPlane.lineTo( center.x + 40, center.y );
      wingPlane.moveTo( center.x - 13, center.y );
      wingPlane.lineTo( center.x - 40, center.y );
      ctx.stroke( wingPlane );
      
      const planeDot = new Path2D();
      planeDot.arc( center.x, center.y, ( radius * 0.04 ), angARad( 0 ), angARad( 360 ));
      ctx.fill( planeDot );

      ctx.strokeStyle = colors.arrow;
      
      const triangle = new Path2D();
      triangle.moveTo( center.x, 35 );
      triangle.lineTo( center.x + 6, 55 );
      triangle.lineTo( center.x - 6, 55 );
      triangle.closePath();
      ctx.stroke(triangle);
   };

   private drawRollIndicatorBase() {
      const { ctx, radius, gradient, center, rollAngle } = this;
      const newPosX = 0, newPosY = 0;
      const baseWidth = 30;

      ctx.save();

      ctx.translate( center.x, center.y );
      ctx.rotate( angARad( rollAngle ));
      ctx.strokeStyle = gradient;
      ctx.lineWidth = baseWidth;

      ctx.beginPath();
      ctx.arc( newPosX, newPosY, ( radius * 0.8 ), angARad( 0 ), angARad( 360 ));
      ctx.stroke();

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc( newPosX, newPosY, ( radius * 0.68 ), angARad( 0 ), angARad( 360 ));
      ctx.stroke();

      ctx.restore();
   };

   private drawRollIndicatorGraduation() {
      const { ctx, radius, center, rollAngle } = this;
      
      ctx.save();
      ctx.translate( center.x, center.y );
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
            
      ctx.fillStyle = colors.graduation;
      ctx.strokeStyle = colors.graduation;

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
         ctx.moveTo( X * ( radius * 0.78 ), Y * ( radius * 0.78 ));
         ctx.arc( X * ( radius * 0.78 ), Y * ( radius * 0.78 ), ( radius * 0.05 ), angARad( 0 ),angARad( 360 ));
         ctx.fill();
      };

      const drawTickSmall = ( X: number, Y: number ) => {
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo( X * ( radius * 0.79 ), Y * ( radius * 0.79 ));
         ctx.lineTo( X * ( radius * 0.69 ), Y * ( radius * 0.69 ));
         ctx.stroke();
      };

      const drawTickLarge = ( X: number, Y: number ) => {
         ctx.lineWidth = 4;
         ctx.beginPath();
         ctx.moveTo( X * ( radius * 0.85 ), Y * ( radius * 0.85 ));
         ctx.lineTo( X * ( radius * 0.69 ), Y * ( radius * 0.69 ));
         ctx.stroke();
      };

      const drawTickZero = ( X: number, Y: number ) => {
         ctx.save();

         ctx.lineWidth = 5;            
         ctx.beginPath();
         ctx.moveTo( X * ( radius * 0.85 ), Y * ( radius * 0.85 ));
         ctx.lineTo( X * ( radius * 0.69 ), Y * ( radius * 0.69 ));
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
      const { ctx, radius, center, rollAngle, pitchAngle } = this;
      const subRadius = radius * 0.7;
      const maxPitchAngle = 45;
      const pitchInPercentage = pitchAngle / maxPitchAngle;

      ctx.save();
      ctx.translate( center.x, center.y );
      ctx.rotate( angARad( rollAngle ));
      
      const gradient = ctx.createLinearGradient( 0, -subRadius, 0, subRadius);
      gradient.addColorStop( 0, colors.sky );
      gradient.addColorStop( 0.5 + ( pitchInPercentage / 2 ), colors.sky );
      gradient.addColorStop( 0.5 + ( pitchInPercentage / 2 ), colors.ground );
      gradient.addColorStop( 1, colors.ground );
      
      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc( 0, 0, subRadius, angARad( 0 ), angARad( 360 ));
      ctx.fill();

      ctx.restore();
   };
   
   private drawPitchIndicatorGraduation() {
      const { ctx, radius, center, rollAngle, pitchAngle } = this;
      const subRadius = radius * 0.7;
      const maxPitchAngle = 45;

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(angARad(rollAngle));

      ctx.strokeStyle = colors.graduation;
      ctx.lineWidth = 2;

      const yCenter = pitchAngle / maxPitchAngle * subRadius;
      ctx.beginPath();
      ctx.moveTo( -subRadius, yCenter );
      ctx.lineTo( subRadius, yCenter );
      ctx.stroke();

      const tickAngles = [ 5, 10, 15, 20 ];
      tickAngles.forEach( angleOffset => {
         const yUp = ( angleOffset + pitchAngle ) / maxPitchAngle * subRadius;
         const yDown = ( pitchAngle - angleOffset ) / maxPitchAngle * subRadius;

         const isPair = angleOffset % 2 === 0;
         const length = isPair ? 35 : 15;
         const half = length / 2;

         ctx.beginPath();
         ctx.moveTo( -half, yUp );
         ctx.lineTo( half, yUp );
         ctx.stroke();

         ctx.beginPath();
         ctx.moveTo( -half, yDown );
         ctx.lineTo( half, yDown );
         ctx.stroke();
      });

      ctx.restore();
   };

   private drawPitchIndicator() {
      const { pitchAngle } = this, maxAngle = 45;

      if( pitchAngle > maxAngle ) this.pitchAngle = maxAngle;
      if( pitchAngle < -maxAngle ) this.pitchAngle = -maxAngle;

      this.drawPitchIndicatorBase();
      this.drawPitchIndicatorGraduation();
   };

   private set setRollAngle( rollAngle: number ) {
      this.rollAngle = rollAngle;
   };

   private set setPitchAngle( pitchAngle: number ) {
      this.pitchAngle = pitchAngle;
   };

   public draw() {
      this.drawStaticBG();
      this.drawPitchIndicator();
      this.drawRollIndicator();
      this.drawStaticFrame();
   };

   public updateAptitudIndicator( rollAngle: number, pitchAngle: number ){
      this.setRollAngle = rollAngle;
      this.setPitchAngle = pitchAngle;
      const size = this.radius * 2;
      this.ctx.clearRect( 0, 0, size, size );
      this.draw();
   }; 
};