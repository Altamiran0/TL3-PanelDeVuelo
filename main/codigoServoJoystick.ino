// Codigo fuente del arduino uno para manejar los servos con el joystick

#include <Wire.h>  // librería para comunicaciones con el pc
#include <Servo.h> // librería para los servos

// DECLARAMOS LAS VARIABLES QUE VAMOS A UTILIZAR
int x;       // Para el valor analógico que recibimos de X
int y;       // Para el valor analógico que recibimos de Y
int servo_x; // Para el valor de X para el servo del eje x
int servo_y; // Para el valor de Y para el servo del eje y

// DECLARAMOS LOS PINES QUE VAMOS A UTILIZAR
#define PIN_VRy A0
#define PIN_VRx A1
#define PIN_servo_x 5 // pin con PWM
#define PIN_servo_y 6 // pin con PWM

Servo motor_x; // creamos el objeto que manejara el eje X
Servo motor_y; // creamos el objeto que manejara el eje Y

void setup()
{

  motor_x.attach(PIN_servo_x); // le asignamos al servo_x los valores del PIN que controla el eje X
  motor_y.attach(PIN_servo_y); // le asignamos al servo_y los valores del PIN que controla el eje Y
}

void loop()
{
  x = analogRead(PIN_VRx); // Leemos el valor de X del joystick
  y = analogRead(PIN_VRy); // Leemos el valor de Y del joystick

  // mapeamos los valores del joystick a grados para los servos
  servo_x = map(x, 0, 1023, 0, 180);
  servo_y = map(y, 0, 1023, 0, 180);

  motor_x.write(servo_x); // le pasamos los grados al servo del eje X
  motor_y.write(servo_y); // le pasamos los grados al servo del eje Y
}