#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>

#define RX_GPS D7
#define TX_GPS D8
#define GPS_BAUD 9600 // Ajuste de velocidad para módulos GY-NEO6MV2

TinyGPSPlus gps;
SoftwareSerial gpsSerial(RX_GPS, TX_GPS);

void setup()
{
    Serial.begin(115200);
    gpsSerial.begin(GPS_BAUD);
    Serial.println("Iniciando GPS...");
}

void loop()
{
    while (gpsSerial.available())
    {
        gps.encode(gpsSerial.read()); // Procesar datos del GPS
    }

    // Mostrar datos procesados
    Serial.print(" Latitud: ");
    if (gps.location.isValid())
        Serial.print(gps.location.lat(), 6);
    else
        Serial.print("ERROR");

    Serial.print(" | Longitud: ");
    if (gps.location.isValid())
        Serial.print(gps.location.lng(), 6);
    else
        Serial.print("ERROR");

    Serial.print(" | Altitud: ");
    if (gps.altitude.isValid())
        Serial.print(gps.altitude.meters());
    else
        Serial.print("ERROR");

    Serial.print(" m | Velocidad: ");
    if (gps.speed.isValid())
        Serial.print(gps.speed.kmph());
    else
        Serial.print("ERROR");

    Serial.print(" km/h | Hora: ");
    if (gps.time.isValid())
    {
        Serial.print(gps.time.hour());
        Serial.print(":");
        Serial.print(gps.time.minute());
        Serial.print(":");
        Serial.print(gps.time.second());
    }
    else
    {
        Serial.print("ERROR");
    }

    Serial.println();
    delay(1000); // Ajuste para capturar datos cada segundo
}