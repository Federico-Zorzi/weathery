import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number | string;
}

@Component({
  selector: 'app-multi-weather',
  imports: [],
  templateUrl: './multi-weather.component.html',
  styleUrl: './multi-weather.component.css',
})
export class MultiWeatherComponent {
  weatherCodeIcons: Record<number, string> = {
    0: '☀️', // Clear sky
    1: '🌤️', 2: '⛅', 3: '☁️', // Cloudy
    45: '🌫️', 48: '🌫️', // Fog
    51: '🌦️', 53: '🌧️', 55: '🌧️', // Drizzle
    56: '🌧️❄️', 57: '🌧️❄️', // Freezing drizzle
    61: '🌧️', 63: '🌧️', 65: '🌧️', // Rain
    66: '🌧️❄️', 67: '🌧️❄️', // Freezing rain
    71: '🌨️', 73: '🌨️', 75: '❄️', // Snow
    77: '🌨️', // Snow grains
    80: '🌦️', 81: '🌧️', 82: '🌩️', // Rain showers
    85: '🌨️', 86: '❄️', // Snow showers
    95: '🌩️', // Thunderstorm
    96: '⛈️', 99: '⛈️' // Thunderstorm with hail
  };

  cities = [
    { name: 'Torino', lat: 45.0703, lon: 7.6869 },
    { name: 'Roma', lat: 41.9028, lon: 12.4964 },
    { name: 'Milano', lat: 45.4642, lon: 9.19 },
    { name: 'Napoli', lat: 40.8518, lon: 14.2681 },
    { name: 'Firenze', lat: 43.7696, lon: 11.2558 }
  ];

  weatherResults: Record<string, WeatherData> = {};
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cities.forEach(city => {
      const cacheKey = `weather-${city.name}`;
      let cached: string | null = null;

      if (typeof window !== 'undefined' && window.localStorage) {
        cached = window.localStorage.getItem(cacheKey);
      }

      if (cached) {
        this.weatherResults[city.name] = JSON.parse(cached);
      } else {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;

        this.http.get(url).subscribe({
          next: (data: unknown) => {
            if (typeof data === 'object' && data !== null && 'current_weather' in data) {
              const weather = (data as { current_weather: WeatherData }).current_weather;
              this.weatherResults[city.name] = weather;

              // ✅ Salvataggio sicuro nel localStorage
              if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(cacheKey, JSON.stringify(weather));
              }
            } else {
              console.error(`Dati malformati per ${city.name}:`, data);
            }
          },
          error: (err: unknown) => {
            if (err instanceof Error) {
              console.error(`Errore per ${city.name}:`, err.message);
            } else {
              console.error(`Errore sconosciuto per ${city.name}:`, err);
            }
          }
        });
      }
    });

    this.isLoading = false;
  }

  getIcon(code: number | string): string {
    const numericCode = typeof code === 'string' ? parseInt(code, 10) : code;
    const icon = this.weatherCodeIcons[numericCode];
    return icon ?? '❓';
  }

}
