#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <MPU6050.h>
#include <Servo.h>
#include <SoftwareSerial.h>

#define JOYSTICK_X A0
#define JOYSTICK_Y D3
#define BOTON_JOYSTICK D4

Servo servoX, servoY;
Adafruit_BMP280 sensorPresionAltitud;
MPU6050 sensorMovimiento;
SoftwareSerial gpsSerial(D7, D8);

void setup()
{
  Serial.begin(115200);
  Wire.begin();

  if (!sensorPresionAltitud.begin(0x76))
    Serial.println("Error: No se encontró el BMP280");
  sensorMovimiento.initialize();
  if (!sensorMovimiento.testConnection())
    Serial.println("Error: No se encontró el MPU6050");
  gpsSerial.begin(9600);

  pinMode(BOTON_JOYSTICK, INPUT_PULLUP);

  servoX.attach(D5);
  servoY.attach(D6);
}

void loop()
{
  int posicionX = analogRead(JOYSTICK_X);
  int posicionY = analogRead(JOYSTICK_Y);
  int estadoBoton = digitalRead(BOTON_JOYSTICK);

  //  Si el botón se presiona, resetear servos al centro
  if (estadoBoton == LOW)
  {
    Serial.println(" Botón presionado: Reiniciando servos...");
    servoX.write(90);
    servoY.write(90);
  }
  else
  {
    //  Mapeo continuo de los servos con el joystick
    int anguloServoX = map(posicionX, 0, 1023, 0, 180);
    int anguloServoY = map(posicionY, 0, 1023, 0, 180);
    servoX.write(anguloServoX);
    servoY.write(anguloServoY);
  }

  // Datos del BMP280
  Serial.print("Presión: ");
  Serial.print(sensorPresionAltitud.readPressure() / 100);
  Serial.println(" hPa");
  Serial.print("Altitud: ");
  Serial.print(sensorPresionAltitud.readAltitude(1013.25));
  Serial.println(" m");

  // Datos del MPU6050
  Serial.print("Ángulo X: ");
  Serial.print(sensorMovimiento.getRotationX());
  Serial.print(", Y: ");
  Serial.print(sensorMovimiento.getRotationY());
  Serial.print(", Z: ");
  Serial.println(sensorMovimiento.getRotationZ());

  // Datos del GPS
  if (gpsSerial.available())
  {
    Serial.print("GPS: ");
    while (gpsSerial.available())
    {
      Serial.write(gpsSerial.read());
    }
    Serial.println();
  }
  else
  {
    Serial.println("GPS no disponible...");
  }

  delay(10);
}