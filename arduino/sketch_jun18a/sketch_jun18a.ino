#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define RAIN_PIN 3

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(RAIN_PIN, INPUT);
}

void loop() {

  // get temperature and humidity ------------------------------------------
  float temp = dht.readTemperature();  // Read temperature in °C
  float hum = dht.readHumidity();      // Read humidity

  // Check if readings failed
  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(5000);
    return;
  }
  //------------------------------------------------------------------------
  // get rain (digital output) --------------------------------------------------------------
  int rain = digitalRead(RAIN_PIN);  // 0 = rain, 1 = no rain
  rain = rain == 0 ? 1 : 0;          // Convert to 1 = rain, 0 = dry for consistency
  //------------------------------------------------------------------------

  //random -----------------------------------------------------------------
  String rtc = String(0) + ":" + String(0) + ":" + String(0);
  int soil = 0;
  int tilt = 0;
  //------------------------------------------------------------------------

  String json = "{\"temp\":" + String(temp, 1) + ",\"hum\":" + String(hum, 1) + ",\"rtc\":\"" + rtc + "\",\"rain\":" + String(rain) + ",\"soil\":" + String(soil) + ",\"tilt\":" + String(tilt) + "}";
  Serial.println(json);
  delay(1000);
}
