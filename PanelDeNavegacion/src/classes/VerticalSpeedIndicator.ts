import type { CenterPoint, ConstructorProps } from "../interfaces";
import { angARad, colors, commonStyles } from "../services";

export class VerticalSpeedIndicator {
   private ctx: CanvasRenderingContext2D;
   private radius: number;
   private center: CenterPoint;
   private verticalSpeed = 0;

   constructor({ ctx, size }: ConstructorProps) {
      this.ctx = ctx;
      this.radius = size / 2;
      this.center = {
         x: this.radius,
         y: this.radius
      };
   };

   private drawStaticFrame() {
      const { ctx, radius, center } = this;      

      ctx.beginPath();
      ctx.arc( center.x, center.y, radius, angARad( 0 ), angARad( 360 ));
      ctx.fillStyle = colors.border;
      ctx.fill();

      ctx.beginPath();
      ctx.arc( center.x, center.y, ( radius * 0.89), angARad( 0 ), angARad( 360 ));
      ctx.fillStyle = colors.background;
      ctx.fill();
   };

   private drawGraduation() {
      const { ctx, radius, center } = this;

      ctx.strokeStyle = colors.graduation;
      ctx.lineCap = "round";

      const drawSmallBrand = ( angle: number ) => {
         ctx.lineWidth = 2;

         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            center.x + ( cos * ( radius * 0.85 )), 
            center.y + ( sen * ( radius * 0.85 ))
         );
         ctx.lineTo( 
            center.x + ( cos * ( radius * 0.75 )), 
            center.y + ( sen * ( radius * 0.75 ))
         );
         ctx.stroke();
      };

      const drawLargeBrand = ( angle: number ) => {
         ctx.lineWidth = 4;

         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            center.x + ( cos * ( radius * 0.85 )), 
            center.y + ( sen * ( radius * 0.85 ))
         );
         ctx.lineTo( 
            center.x + ( cos * ( radius * 0.70 )), 
            center.y + ( sen * ( radius * 0.70 ))
         );
         ctx.stroke();
      };

      const brands = 21;
      const majorStep = 5;
      const startRad = 180;
      const endRad = 2;
      const radRange = endRad - startRad;
      const step = radRange / brands;

      for( let i = 0; i < brands; i++ ) {
         const isMajor = i % majorStep === 0;
         const brandAngle = step * i - 180;
         
         if( isMajor ) {
            drawLargeBrand( brandAngle );
            drawLargeBrand( - brandAngle );
         } else {
            drawSmallBrand( brandAngle );
            drawSmallBrand( - brandAngle );
         }
      };
   };

   private drawNumbers() {      
      const { ctx, radius, center } = this;

      ctx.fillStyle = colors.numbers;
      ctx.font = commonStyles.numbersFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const radRange = -170;
      const numbers = 4;
      const step = radRange / numbers;
      const textRadius = radius * 0.57;

      ctx.fillText( '0', center.x - textRadius, center.y + 2 );
      
      for ( let i = 1; i < numbers ; i++ ) {
         const brandAngle = step * i - 180;
         const angInRad = angARad( brandAngle );
         const cos = Math.cos( angInRad ), sin = Math.sin( angInRad );

         const x = center.x + cos * textRadius;
         const y = center.y + 1 + sin * textRadius;
         const negY = center.y + 2 - ( sin * textRadius );

         ctx.fillText(( i * 5 ).toString(), x, y );
         ctx.fillText(( i * 5 ).toString(), x, negY );
      };

      ctx.fillText( '20', center.x + textRadius, center.y + 2 );
   };

   private drawNeedles() {
      const { ctx, radius, center, verticalSpeed } = this;
      const gradient = ctx.createLinearGradient( -120, 0, 50, 0 );
      gradient.addColorStop( 0, colors.whiteNeedle );
      gradient.addColorStop( 0.68, colors.whiteNeedle );
      gradient.addColorStop( 0.68, colors.blackNeedle );
      ctx.fillStyle = gradient;
      ctx.strokeStyle = colors.blackNeedle;
      ctx.lineWidth = 1;

      const getValueAng = () => {
         const maxValue = 20;
         const rangeRad = angARad( 170 );
         const signo = Math.sign( verticalSpeed );

         if(( verticalSpeed > maxValue ) || ( verticalSpeed < -maxValue )) 
            return signo * ( 20 / maxValue * rangeRad );

         return verticalSpeed / maxValue * rangeRad ;
      };
      const valueAng = getValueAng();

      ctx.save();
      ctx.translate( center.x, center.y );
      ctx.rotate( valueAng );
      ctx.beginPath();
      ctx.moveTo( 45, 0 );
      ctx.arc( 45, 0, ( radius * 0.05 ), angARad( 0 ), angARad( 360 ));
      ctx.moveTo(( 45 - ( radius * 0.05 )), -3 );
      ctx.lineTo( -5, -3 );
      ctx.lineTo( -5, -5 );
      ctx.lineTo( -60, -5 );
      ctx.lineTo(( -radius * 0.55 ), -4 );
      ctx.lineTo(( -radius * 0.75 ), 0 );
      ctx.lineTo(( -radius * 0.55 ), 4 );
      ctx.lineTo( -60, 5 );
      ctx.lineTo( -5, 5 );
      ctx.lineTo( -5, 3 );
      ctx.lineTo( ( 45 - ( radius * 0.05 )), 3 );
      ctx.fill();
      ctx.stroke();

      ctx.restore();
   };

   private set setVerticalSpeed( verticalSpeed: number ) {
      this.verticalSpeed = verticalSpeed;
   };

   draw() {
      this.drawStaticFrame();
      this.drawGraduation();
      this.drawNumbers();
      this.drawNeedles();
   };

   updateVerticalSpeedIndicator( verticalSpeed: number ){
      this.setVerticalSpeed = verticalSpeed;
      this.draw();
   };  
};

