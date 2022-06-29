// Sonde TDS DATA PIN = A1
// Sonde Temp DATA PIN = 7
#include <EEPROM.h>
#include "GravityTDS.h"
#include <OneWire.h>
#include <Ethernet.h>
#include <ArduinoJson.h>
#include <DallasTemperature.h>

#define TdsSensorPin A1
#define ONE_WIRE_BUS 7
#define RELAYBULLER 2
#define RELAYLIGHT 3
#define ALARMTEMP 4
#define ALARMTDS 5

OneWire oneWire(ONE_WIRE_BUS);
GravityTDS gravityTds;
DallasTemperature sensors(&oneWire);
EthernetServer server(80);
byte mac[] = {  0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x01 };
const size_t CAPACITYDATA = JSON_ARRAY_SIZE(9);
 
float temperature = 0;
float tdsValue = 0;

void setup() {
    Serial.begin(9600);
    Ethernet.begin(mac);
    //Serial.print("Server address:");
    //Serial.println(Ethernet.localIP());
    server.begin();
    sensors.begin();
    gravityTds.setPin(TdsSensorPin);
    gravityTds.setAref(5.0);
    gravityTds.setAdcRange(1024);
    gravityTds.begin();
    pinMode(RELAYBULLER, OUTPUT);
    pinMode(RELAYLIGHT, OUTPUT);
    pinMode(ALARMTEMP, OUTPUT);
    pinMode(ALARMTDS, OUTPUT);
    digitalWrite(RELAYBULLER, HIGH);
    digitalWrite(RELAYLIGHT, HIGH);
    digitalWrite(ALARMTEMP, HIGH);
    digitalWrite(ALARMTDS, HIGH);
}
 
void loop() {
    sensors.requestTemperatures();
    
    gravityTds.setTemperature(sensors.getTempCByIndex(0));
    gravityTds.update();
    tdsValue = gravityTds.getTdsValue();

    char buffer[CAPACITYDATA];
    EthernetClient client = server.available();
    StaticJsonDocument<CAPACITYDATA> dataJson;

    dataJson["data"]["tds"] = tdsValue;
    dataJson["data"]["temp"] = sensors.getTempCByIndex(0);
    serializeJsonPretty(dataJson, buffer);

    if (client) {
      boolean currentLineIsBlank = true;
      String bufferRequest = "";
      while (client.connected()) {
        if (client.available()) {
          char c = client.read();
          bufferRequest += c;
          if (c == '\n' && currentLineIsBlank) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-Type: application/json;charset=utf-8");
            client.println("Server: Aquarium Domotique");
            client.println("Connection: close");
            client.println();
            client.println(buffer);
            client.println();
            break;
          }
          else if (c == '\n') {
            currentLineIsBlank = true;
          }
          else if (c == '\r') {
            currentLineIsBlank = true;
            if (bufferRequest.indexOf("GET /?buller=ON") >= 0) {
              digitalWrite(RELAYBULLER, LOW);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?buller=OFF") >= 0) {
              digitalWrite(RELAYBULLER, HIGH);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?light=ON") >= 0) {
              digitalWrite(RELAYLIGHT, LOW);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?light=OFF") >= 0) {
              digitalWrite(RELAYLIGHT, HIGH);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?alarmTemp=ON") >= 0) {
              digitalWrite(ALARMTEMP, LOW);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?alarmTemp=OFF") >= 0) {
              digitalWrite(ALARMTEMP, HIGH);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?alarmTDS=ON") >= 0) {
              digitalWrite(ALARMTDS, LOW);
              delay(500);
            }
            if (bufferRequest.indexOf("GET /?alarmTDS=OFF") >= 0) {
              digitalWrite(ALARMTDS, HIGH);
              delay(500);
            }
          }
          else if (c != '\r') {
            currentLineIsBlank = false;
          }
        }
      }
    }

    //Serial.print(tdsValue);
    //Serial.println(" Ppm");
    //Serial.print("Temperature: "); 
    //Serial.println(sensors.getTempCByIndex(0));
    
    client.stop();
    delay(1000);
}
