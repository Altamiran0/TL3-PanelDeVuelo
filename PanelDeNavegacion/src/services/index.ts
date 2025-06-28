export const colors = {
   border: 'black',
   background: 'rgb(20, 20, 20)',
   anemometerArcs: {
      yellow: '#e3dc1e',
      green: '#3ea30b',
      white: 'white'
   },
   graduation: 'white',
   numbers: 'white',
   whiteNeedle: 'rgb(225, 225, 225)',
   blackNeedle: 'rgb(30, 30, 30)',
   sky: '#2d6def',
   ground: '#aa5a0b',
   plane: 'black',
   arrow: '#f48303',
};

export const commonStyles = {
   numbersFont: '600 22px system-ui',
   legendsFont: '600 14px system-ui',
   altimeterLegendsFont: '600 18px system-ui'
}

export function angARad( angulo: number ){
   return angulo * Math.PI / 180;
};

export const initialAircraftData = {
   isConnected: false,
   GPSmodule_isWork: false,
   windSpeed: 0,
   verticalSpeed: 0,
   altitud: 0,
   pitchAngle: 0,
   rollAngle: 0,
   lat: 0,
   lng: 0
};