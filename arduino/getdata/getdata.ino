#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

#define RAIN_PIN 3
#define SOIL_MOISTURE_PIN A0  // Analog pin for soil moisture sensor
#define MQ2_PIN A1            // Analog pin for MQ2 smoke/gas sensor
#define TILT_PIN 7            // Digital pin for tilt sensor

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(RAIN_PIN, INPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(MQ2_PIN, INPUT);
  pinMode(TILT_PIN, INPUT);
}

void loop() {
  // Temperature and humidity
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(5000);
    return;
  }

  // Rain sensor (digital)
  int rain = digitalRead(RAIN_PIN);
  rain = rain == 0 ? 1 : 0;

  // Soil moisture sensor (analog)
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  int soilMoisturePercent = map(soilMoistureRaw, 1023, 0, 0, 100);

  // MQ2 smoke sensor (analog)
  int smokeRaw = analogRead(MQ2_PIN);  // Value between 0–1023

  // Tilt sensor (digital)
  int tilt = digitalRead(TILT_PIN);  // 1 = tilted, 0 = stable

  // JSON Output
  String json = "{\"temp\":" + String(temp, 1) + ",\"hum\":" + String(hum, 1) + ",\"rain\":" + String(rain) + ",\"soil\":" + String(soilMoisturePercent) + ",\"smoke\":" + String(smokeRaw) + ",\"tilt\":" + String(tilt) + "}";

  Serial.println(json);
  delay(1000);
}
