import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface GeoResponse {
  results: {
    name: string;
    latitude: number;
    longitude: number;
  }[];
}

interface ForecastData {
  city: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    windspeed_10m: number[];
    precipitation_probability: number[];
    uv_index: number[];
    weathercode: number[];
  };
}

@Component({
  selector: 'app-search-weather',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-weather.component.html',
  styleUrl: './search-weather.component.css'
})

export class SearchWeatherComponent {
 cityName = '';
 forecast: ForecastData | null = null;

  constructor(private http: HttpClient) {}

  async searchCity() {
    if (!this.cityName) return;

    // Latitudine e longitudine della città
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(this.cityName)}&count=1&language=it&format=json`;
    try {
      const geoRes = await this.http.get<GeoResponse>(geoUrl).toPromise();

      if (!geoRes || !geoRes.results || geoRes.results.length === 0) {
        throw new Error('Città non trovata');
      }

      const { latitude, longitude, name } = geoRes.results[0];

      // Meteo settimanale e giornaliero
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,apparent_temperature,windspeed_10m,precipitation_probability,uv_index,weathercode&timezone=auto`;
      const weatherRes = await this.http.get<ForecastData>(weatherUrl).toPromise();

      console.log('weatherRes' , weatherRes);

      this.http.get(weatherUrl).subscribe((res: any) => {
        this.forecast = {
          city: name,
          daily: res.daily,
          hourly: res.hourly
        };
      });

      console.log('forecast' , this.forecast);

    } catch (err) {
      console.error('Errore:', err);
      alert((err instanceof Error) ? err.message : 'Errore sconosciuto');
    }
  }
}
