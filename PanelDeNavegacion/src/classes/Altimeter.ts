import type { CenterPoint, ConstructorProps } from "../interfaces";
import { angARad, colors, commonStyles } from "../services";

export class Altimeter {
   private ctx: CanvasRenderingContext2D;
   private radius: number;
   private center: CenterPoint;
   private altitud = 0;
   // altitud: distancia vertical entre el nivel medio del mar y un punto en el aire.
   // altura: distancia vertical entre el terreno y un punto en el aire.
   // elevacion: distancia entre el nivel medio del mar y un punto en el terreno.

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
      ctx.arc( center.x, center.y, radius, 0, Math.PI * 2 );
      ctx.fillStyle = colors.border;
      ctx.fill();

      ctx.beginPath();
      ctx.arc( center.x, center.y, ( radius * 0.89 ), 0, Math.PI * 2 );
      ctx.fillStyle = colors.background;
      ctx.fill();  

      ctx.beginPath();
      ctx.arc( center.x, center.y, ( radius * 0.4 ), 0, Math.PI * 2 );
      ctx.fillStyle = colors.border;
      ctx.fill();
   };

   private drawGraduation() {
      const { ctx, radius, center } = this;

      ctx.strokeStyle = colors.graduation;
      ctx.lineCap = "round";
      ctx.lineWidth = 2.5;

      const drawMediumBrand = ( angle: number ) => {
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
         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            center.x + ( cos * ( radius * 0.85 )), 
            center.y + ( sen * ( radius * 0.85 ))
         );
         ctx.lineTo( 
            center.x + ( cos * ( radius * 0.69 )), 
            center.y + ( sen * ( radius * 0.69 ))
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
         
         if( isMajor ) 
            drawLargeBrand( brandAngle );
         else
            drawMediumBrand( brandAngle );
      };
   };

   private drawNumbers() {      
      const { ctx, radius, center } = this;

      ctx.fillStyle = colors.numbers;
      ctx.font = commonStyles.numbersFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const numbers = 10;
      const radRange = 360;
      const step = radRange / numbers;
      const textRadius = radius * 0.55;
      
      for (let i = 0; i < numbers; i++) {
         const brandAngle = ( step * i ) - 90;
         const angInRad = angARad( brandAngle );
         const cos = Math.cos( angInRad ), sin = Math.sin( angInRad );

         const x = center.x + cos * textRadius;
         const y = center.y + 1 + sin * textRadius;

         ctx.fillText( i.toString(), x, y );
      };
   };

   private drawLegends() {
      const { ctx, radius, center } = this;

      ctx.fillStyle = colors.numbers;
      ctx.font = commonStyles.altimeterLegendsFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.save();
      ctx.translate( center.x, center.y );

      ctx.fillText( "ALT", ( -radius * 0.15 ), ( -radius * 0.2 ));
      ctx.font = commonStyles.legendsFont;
      ctx.fillText( "m", ( radius * 0.1 ), ( -radius * 0.65 ));

      ctx.restore();
   };

   private drawNeedles() {
      const { ctx, radius, center, altitud } = this;

      const firstDigit = altitud % 10;
      const secondDigit = ( altitud - firstDigit ) / 10;

      const rangeRad = angARad( 360 );
      const maxValue = 10;

      const drawLargeNeedle = () => {
         const valueAng = ( firstDigit / maxValue ) * rangeRad;
         const gradient = ctx.createLinearGradient( 0, -120, 0, 50 );
         gradient.addColorStop( 0, colors.whiteNeedle );
         gradient.addColorStop( 0.68, colors.whiteNeedle );
         gradient.addColorStop( 0.68, colors.blackNeedle );
         ctx.fillStyle = gradient;
         ctx.strokeStyle = colors.blackNeedle;
         ctx.lineWidth = 1;

         ctx.save();
         ctx.translate( center.x, center.y );
         ctx.rotate( valueAng );

         ctx.beginPath();
         
         ctx.moveTo( 0, 45 );
         ctx.arc( 0, 45, ( radius * 0.05), angARad( -65 ), angARad( 245 ));
         ctx.lineTo( -3, -5 );
         ctx.lineTo( -5, -5 );
         ctx.lineTo( -5, -60 );
         ctx.lineTo( -4, -radius * 0.55 );
         ctx.lineTo( 0, -radius * 0.75 );
         ctx.lineTo( 4, -radius * 0.55 );
         ctx.lineTo( 5, -60 );
         ctx.lineTo( 5, -5 );
         ctx.lineTo( 3, -5 );
         ctx.lineTo( 3, 45 );
         ctx.fill();
         ctx.stroke();

         ctx.restore();
      };

      const drawShortNeedle = () => {
         const valueAng = ( secondDigit / maxValue ) * rangeRad;
         const gradient = ctx.createLinearGradient( 0, -120, 0, 50 );
         gradient.addColorStop( 0, colors.whiteNeedle );
         gradient.addColorStop( 0.68, colors.whiteNeedle );
         gradient.addColorStop( 0.68, colors.blackNeedle );
         ctx.fillStyle = gradient;

         ctx.save();
         ctx.translate( center.x, center.y );
         ctx.rotate( valueAng );

         ctx.beginPath();
         ctx.moveTo( 6, -10 );
         ctx.lineTo( 15, -40);
         ctx.lineTo( 0, -60);
         ctx.lineTo( -15, -40);
         ctx.lineTo( -6, -10);
         ctx.moveTo( 6, -10 );
         ctx.lineTo( 6, 5);
         ctx.arc( 0, 0, ( radius * 0.22 ), angARad( 62 ), angARad( 115 ));
         ctx.lineTo( -6, 5);
         ctx.lineTo( -6, -10);
         ctx.fill();

         ctx.restore();
      };

      drawShortNeedle();
      drawLargeNeedle();
   };

   private set setAltitud( altitud: number ) {
      if( altitud > 99 ) altitud = 99;
      this.altitud = altitud;
   };

   draw() {
      this.drawStaticFrame();
      this.drawGraduation();
      this.drawNumbers();
      this.drawLegends();
      this.drawNeedles();
   };

   updateAltimeter( altitud: number ){
      this.setAltitud = altitud;
      this.draw();
   };  
};

