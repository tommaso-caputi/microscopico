#include <DHT.h>
#include <DS1302.h>  // Include DS1302 Real-Time Clock library

#define DHTPIN 2
#define DHTTYPE DHT11

#define RAIN_PIN 3
#define SOIL_MOISTURE_PIN A0  // Analog pin for soil moisture sensor
#define TILT_PIN 7            // Digital pin for tilt sensor

// DS1302 RTC module pin definitions
#define RTC_CLK_PIN 4  // Clock pin for DS1302
#define RTC_DAT_PIN 5  // Data pin for DS1302 (bidirectional)
#define RTC_RST_PIN 6  // Reset pin for DS1302

DHT dht(DHTPIN, DHTTYPE);
DS1302 rtc(RTC_RST_PIN, RTC_DAT_PIN, RTC_CLK_PIN);  // Create RTC object with pin configuration

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(RAIN_PIN, INPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);  // Set soil moisture pin as input
  pinMode(TILT_PIN, INPUT);           // Set tilt sensor pin as input

  // Initialize DS1302 RTC module
  rtc.halt(false);                                    // Start the RTC (false = running, true = stopped)
  rtc.writeProtect(false);                            // Allow writing to RTC registers (false = writable, true = protected)
  Time t(2025, 6, 18, 16, 51, 00, Time::kWednesday);  //init time(only for setup)
  rtc.time(t);
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
  // get rain (digital output) ---------------------------------------------
  int rain = digitalRead(RAIN_PIN);  // 0 = rain, 1 = no rain
  rain = rain == 0 ? 1 : 0;          // Convert to 1 = rain, 0 = dry for consistency
  //------------------------------------------------------------------------

  // get soil moisture (analog output) -------------------------------------
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);              // Read raw analog value (0-1023)
  int soilMoisturePercent = map(soilMoistureRaw, 1023, 0, 0, 100);  // Convert to percentage
  //------------------------------------------------------------------------

  // get tilt status (digital output) --------------------------------------
  int tilt = digitalRead(TILT_PIN);  // 1 = tilted, 0 = stable
  //------------------------------------------------------------------------

  // get time from DS1302 RTC ----------------------------------------------
  Time t = rtc.time();
  const String day = dayAsString(t.day);
  char buf[50];
  snprintf(buf, sizeof(buf), "%s %04d-%02d-%02d %02d:%02d:%02d",
           day.c_str(),
           t.yr, t.mon, t.date,
           t.hr, t.min, t.sec);
  //------------------------------------------------------------------------

  String json = "{\"temp\":" + String(temp, 1) + ",\"hum\":" + String(hum, 1) + ",\"rtc\":\"" + buf + "\",\"rain\":" + String(rain) + ",\"soil\":" + String(soilMoisturePercent) + ",\"tilt\":" + String(tilt) + "}";

  Serial.println(json);
  delay(1000);
}

String dayAsString(const Time::Day day) {
  switch (day) {
    case Time::kSunday: return "Sunday";
    case Time::kMonday: return "Monday";
    case Time::kTuesday: return "Tuesday";
    case Time::kWednesday: return "Wednesday";
    case Time::kThursday: return "Thursday";
    case Time::kFriday: return "Friday";
    case Time::kSaturday: return "Saturday";
  }
  return "(unknown day)";
}
