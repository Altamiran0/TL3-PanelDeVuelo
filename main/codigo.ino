#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <MPU6050.h>

#define RX_GPS D7
#define TX_GPS D8

Adafruit_BMP280 bmp;
TinyGPSPlus gps;
SoftwareSerial gpsSerial(RX_GPS, TX_GPS);
MPU6050 mpu;

int16_t ax, ay, az; // Aceleraciones
int16_t gx, gy, gz; // Giroscopio

void setup()
{
  Serial.begin(115200);
  Wire.begin();
  gpsSerial.begin(9600);

  Serial.println(" Iniciando sensores...");

  // Inicializar BMP280
  if (!bmp.begin(0x76))
  {
    Serial.println(" BMP280 no encontrado!");
    while (1)
      ;
  }

  // Inicializar MPU6050
  mpu.initialize();
  if (!mpu.testConnection())
  {
    Serial.println(" MPU6050 no encontrado!");
    while (1)
      ;
  }

  Serial.println("Sensores listos: BMP280 y MPU6050.");
}

void loop()
{
  // Leer datos del GPS
  while (gpsSerial.available())
    gps.encode(gpsSerial.read());

  //  Obtener datos de altitud y presión
  float altitud = bmp.readAltitude(1013.25);
  float presion = bmp.readPressure() / 100.0;

  //  Obtener aceleración y giroscopio del MPU6050
  mpu.getAcceleration(&ax, &ay, &az);
  mpu.getRotation(&gx, &gy, &gz);

  Serial.print(" |  Altitud: ");
  Serial.print(altitud);
  Serial.print(" m | Presión: ");
  Serial.print(presion);
  Serial.print(" hPa |  Acc X: ");
  Serial.print(ax);
  Serial.print(" | Y: ");
  Serial.print(ay);
  Serial.print(" | Z: ");
  Serial.println(az);

  delay(1000);
}