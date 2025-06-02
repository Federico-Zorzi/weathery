import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../utils/utils.service';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number | string;
}

@Component({
  selector: 'app-multi-weather',
  templateUrl: './multi-weather.component.html',
  styleUrl: './multi-weather.component.css',
})
export class MultiWeatherComponent {
  cities = [
    { name: 'Torino', lat: 45.0703, lon: 7.6869 },
    { name: 'Roma', lat: 41.9028, lon: 12.4964 },
    { name: 'Milano', lat: 45.4642, lon: 9.19 },
    { name: 'Napoli', lat: 40.8518, lon: 14.2681 },
    { name: 'Firenze', lat: 43.7696, lon: 11.2558 }
  ];

  weatherResults: Record<string, WeatherData> = {};
  isLoading = true;

constructor(
  private http: HttpClient,
  private utils: UtilsService
) {}

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

  getIcon(code: number | string){
   return this.utils.getIcon(code)
  }
}
