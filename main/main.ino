#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <ESP8266WebServer.h>
#include <Ticker.h>
#include <LittleFS.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include "I2Cdev.h"
#include <MPU6050.h>

// ————— CONFIG Wi‑Fi —————
const char* ssid     = "MovistarFibra-2022";
const char* password = "23452345";

// ————— Sensores —————
Adafruit_BMP280 bmp;
MPU6050 mpu;

// ————— WebSocket —————
ESP8266WebServer httpServer(80);
WebSocketsServer wsServer(81);
Ticker      ticker;

// Variables MPU
int16_t ax, ay, az;

void sendNavData() {
  // Leer estado conexión
  bool connected = (WiFi.status() == WL_CONNECTED);

  // Leer BMP280
  float altitud = bmp.readAltitude(1013.25);  // referencia al nivel del mar
  // No tenemos sensor de viento → 0
  float windSpeed = 0.0;

  // Leer MPU6050
  mpu.getAcceleration(&ax, &ay, &az);
  float roll  = atan(ax / sqrt(pow(ay, 2) + pow(az, 2))) * (180.0 / 3.14);
  float pitch = atan(ay / sqrt(pow(ax, 2) + pow(az, 2))) * (180.0 / 3.14);

 // No hay GPS ni velocidad vertical → false y 0
  bool gpsOk         = false;
  float verticalSpeed = 0.0;
  double lat = 0.0, lng = 0.0;

  // Construir JSON
  String json = "{";
  json += "\"isConnected\":"      + String(connected ? "true" : "false") + ",";
  json += "\"GPSmodule_isWork\":" + String(gpsOk     ? "true" : "false") + ",";
  json += "\"windSpeed\":"        + String(windSpeed, 2)            + ",";
  json += "\"altitud\":"          + String(altitud, 2)              + ",";
  json += "\"verticalSpeed\":"    + String(verticalSpeed, 2)        + ",";
  json += "\"rollAngle\":"        + String(roll, 2)                  + ",";
  json += "\"pitchAngle\":"       + String(pitch, 2)                 + ",";
  json += "\"lat\":"              + String(lat, 6)                   + ",";
  json += "\"lng\":"              + String(lng, 6);
  json += "}";

  // Enviar a todos los clientes WS
  wsServer.broadcastTXT(json);
}

void setup() {
  Serial.begin(115200);
  Wire.begin();

    // Montar sistema de archivos LittleFS
  if (!LittleFS.begin()) {
    Serial.println("Error montando LittleFS");
    while (1) { yield(); }
  }

  // Iniciar sensores
  if (!bmp.begin(0x76)) {
    Serial.println("Error inicializando BMP280");
    while (1);
  }
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("Error inicializando MPU6050");
    while (1);
  }

  // Conectar Wi‑Fi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP asignada: ");
  Serial.println(WiFi.localIP());

  // ——— Servidor HTTP en el puerto 80 ———
  // Servir index.html al hacer GET /
    httpServer.on("/", HTTP_GET, []() {
    File f = LittleFS.open("/index.html", "r");
    if (!f) {
      httpServer.send(404, "text/plain", "Archivo no encontrado");
      return;
    }
      httpServer.streamFile(f, "text/html");
    f.close();
    });

  // Servir automáticamente cualquier otro archivo estático
  httpServer.serveStatic("/", LittleFS, "/");
  httpServer.begin();
  Serial.println("HTTP server listo en puerto 80");

  // ——— Servidor WebSocket en el puerto 81 ———
  wsServer.begin();
  wsServer.onEvent([](uint8_t num, WStype_t type, uint8_t *payload, size_t length){
    // No procesamos mensajes entrantes
  });
  Serial.println("WebSocket server listo en puerto 81");

  // Archer el envío periódico cada 250 ms
  ticker.attach_ms(250, sendNavData);
}


void loop() {
  httpServer.handleClient();  // atiende peticiones HTTP
  wsServer.loop();            // atiende clientes WebSocket
}
