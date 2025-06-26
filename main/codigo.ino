#include <Wire.h>
#include <Adafruit_BMP280.h>
// #include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <MPU6050.h>
#include "I2Cdev.h"

#define RX_GPS D7
#define TX_GPS D8

Adafruit_BMP280 bmp;
// TinyGPSPlus gps;
// SoftwareSerial gpsSerial(RX_GPS, TX_GPS);
MPU6050 mpu;

int16_t ax, ay, az; // Aceleraciones
int16_t gx, gy, gz; // Giroscopio

void setup()
{
  Serial.begin(9600);
  Wire.begin();

  Serial.println(" Iniciando sensores...");
  mpu.initialize();

  // Inicializar BMP280 MPU6050
  if (!bmp.begin(0x76) && !mpu.testConnection())
  {
    Serial.println(" BMP280 y MPU6050 no encontrados");
    while (1)
  }

  Serial.println("Sensores listos: BMP280 y MPU6050.");
}

void loop()
{

  //  Obtener datos de altitud y presión
  float altitud = bmp.readAltitude(1013.25);
  float presion = bmp.readPressure() / 100.0;

  //  Obtener aceleración y giroscopio del MPU6050
  mpu.getAcceleration(&ax, &ay, &az);

  // Calcular los angulos de inclinacion:
  float accel_ang_x = atan(ax / sqrt(pow(ay, 2) + pow(az, 2))) * (180.0 / 3.14);
  float accel_ang_y = atan(ay / sqrt(pow(ax, 2) + pow(az, 2))) * (180.0 / 3.14);

  // Muestra datos bmp
  Serial.print(" |  Altitud: ");
  Serial.print(altitud);
  Serial.print(" m | Presión: ");
  Serial.print(presion);
  Serial.println("hPa");
  // datos del mpu
  Serial.print(" Acc X: ");
  Serial.print(accel_ang_x);
  Serial.print(" | Y: ");
  Serial.print(accel_ang_y);

  delay(250);
}
