import type { ConstructorProps, CenterPoint } from "../interfaces";
import { angARad, colors, commonStyles } from "../services";

export class Anemometer {
   private ctx: CanvasRenderingContext2D;
   private radius: number;
   private center: CenterPoint
   private windSpeed = 0;

   constructor({ ctx, size }: ConstructorProps) {
      this.ctx = ctx;
      this.radius = size / 2;
      this.center = {
         x: this.radius,
         y: this.radius
      };
   };

   private setCommonProperties() {
      const { ctx } = this;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
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
   };

   private drawArcs() {
      const { ctx, radius, center } = this;
      const arcRadius = radius * 0.84;
      ctx.lineWidth = radius * 0.09;

      ctx.strokeStyle = colors.anemometerArcs.yellow;
      const yellowArc = new Path2D();
      yellowArc.arc( center.x, center.y, arcRadius, angARad( 145 ), angARad( 225 ));
      ctx.stroke( yellowArc );

      ctx.strokeStyle = colors.anemometerArcs.green;
      const greenArc = new Path2D();
      greenArc.arc( center.x, center.y, arcRadius, angARad( 325 ), angARad( 145 ));
      ctx.stroke( greenArc );

      ctx.lineWidth = radius * 0.05;
      ctx.strokeStyle = colors.anemometerArcs.white;
      const whiteArc = new Path2D();
      whiteArc.arc( center.x, center.y, arcRadius - 3.7, angARad( 315 ), angARad( 45 ));
      ctx.stroke( whiteArc );
   };

   private drawGraduation() {
      const { ctx, radius, center } = this;
      const brandsStart = radius * 0.885;
      ctx.strokeStyle = colors.graduation;
      
      const drawSmallBrand = ( angle: number ) => {
         const brandsEnd = radius * 0.77;
         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );
         
         ctx.beginPath();
         ctx.moveTo( 
            center.x + cos * brandsStart, 
            center.y + sen * brandsStart
         );
         ctx.lineTo( 
            center.x + cos * brandsEnd, 
            center.y + sen * brandsEnd
         );
         ctx.stroke();
      };

      const drawLargeBrand = ( angle: number ) => {
         const brandsEnd = radius * 0.72;
         const angInRad = angARad( angle );
         const cos = Math.cos( angInRad ), sen = Math.sin( angInRad );

         ctx.beginPath();
         ctx.moveTo( 
            center.x + cos * brandsStart, 
            center.y + sen * brandsStart
         );
         ctx.lineTo( 
            center.x + cos * brandsEnd, 
            center.y + sen * brandsEnd
         );
         ctx.stroke();
      };

      const brands = 38;
      const startRad = -80;
      const endRad = 260; 

      const step = ( endRad - startRad ) / brands;
      const majorStep = 2;

      for( let i = 0; i <= brands; i++ ) {
         const isSmall = i % majorStep === 0;
         const brandAngle = step * i + startRad;
         ctx.lineWidth = isSmall ? 2 : 3;
         
         if( isSmall ) drawSmallBrand( brandAngle );
         else drawLargeBrand( brandAngle );
      };
   };

   private drawNumbers() {      
      const { ctx, radius, center } = this;
      const textRadius = radius * 0.58;
      const startRad = angARad( -70 );
      const endRad = angARad( 250 );
      const numbers = 9;
      const step = ( endRad - startRad ) / numbers;  

      ctx.fillStyle = colors.numbers;
      ctx.font = commonStyles.numbersFont;


      for (let i = 0; i <= numbers; i++) {
         const valueAng = startRad + step * i;
         const cos = Math.cos( valueAng );
         const sin = Math.sin( valueAng );

         const x = center.x + cos * textRadius;
         const y = center.y + sin * textRadius;

         const value = Math.round( 5 * ( i + 1 ));

         ctx.fillText( value.toString(), x, y );
      };
   };

   private drawLegends() {
      const { ctx, center } = this;      
      ctx.font = commonStyles.legendsFont;
      ctx.fillText( 'AIRSPEED', center.x, center.y - 20 );
      ctx.fillText( 'km / h', center.x, center.y + 20 );
   };
   
   private drawNeedle() {
      const { ctx, radius, center, windSpeed } = this;
      const maxValue = 51.25;
      const scaleChangeValue = 5;
      let valueAng = 0;

      if( windSpeed < scaleChangeValue ) {
         const effectiveValue = Math.max( 0, windSpeed );

         const startDeg = -80;
         const endDeg = -70;
         const totalDeg = endDeg - startDeg;
   
         const deg = ( effectiveValue / scaleChangeValue ) * totalDeg;
         valueAng = angARad( deg );
      } else {
         const effectiveValue = Math.min( windSpeed, maxValue );

         const startDeg = -70;
         const endDeg = 260;
         const totalDeg = endDeg - startDeg;
  
         const valueRange = maxValue - scaleChangeValue;
         const deg = (( effectiveValue - scaleChangeValue + 1.25 ) / valueRange ) * totalDeg;
         valueAng = angARad( deg );
      };

      const gradient = ctx.createLinearGradient( 0, -120, 0, 50 );
      gradient.addColorStop( 0, colors.whiteNeedle );
      gradient.addColorStop( 0.68, colors.whiteNeedle );
      gradient.addColorStop( 0.68, colors.blackNeedle );
      ctx.fillStyle = gradient;
      ctx.strokeStyle = colors.blackNeedle;
      ctx.lineWidth = 1;

      ctx.save();
      ctx.translate( center.x, center.y );
      ctx.rotate( valueAng + angARad( 10 ));

      ctx.beginPath();
      ctx.moveTo( 0, 45 );
      ctx.arc( 0, 45, ( radius * 0.05), angARad( -65 ), angARad( 245 ));
      ctx.lineTo( -3, -5 );
      ctx.lineTo( -5, -5 );
      ctx.lineTo( -5, -60 );
      ctx.lineTo( -2, -70 );
      ctx.lineTo( -2, -95 );
      ctx.lineTo( 2, -95 );
      ctx.lineTo( 2, -70 );
      ctx.lineTo( 5, -60 );
      ctx.lineTo( 5, -5 );
      ctx.lineTo( 3, -5 );
      ctx.lineTo( 3, 45 );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
   };

   public draw() {
      this.setCommonProperties();
      this.drawStaticFrame();
      this.drawArcs();
      this.drawGraduation();
      this.drawNumbers();
      this.drawLegends();
      this.drawNeedle();
   };

   private set setWindSpeed( windSpeed: number ) {
      this.windSpeed = windSpeed;
   };

   public updateAnemometer( windSpeed: number ) {
      this.setWindSpeed = windSpeed;
      this.draw();
   };
};