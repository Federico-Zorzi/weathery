import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../utils/utils.service';

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
  selectedDate: string | null = null;
  selectedHour: string | null = null;

  daySelected: {
    time: string[];
    weathercode: number[];
    apparent_temperature: number[];
  } = {
    time: [],
    weathercode: [],
    apparent_temperature: [],
  };

  hourSelected: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    windspeed_10m: number;
    precipitation_probability: number;
    uv_index: number;
    } = {
    time: "",
    temperature_2m: 0,
    apparent_temperature:  0,
    windspeed_10m: 0,
    precipitation_probability: 0,
    uv_index: 0
  };


  constructor(private http: HttpClient,
              private utils: UtilsService) {}

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

      this.http.get(weatherUrl).subscribe((res: any) => {
        this.forecast = {
          city: name,
          daily: res.daily,
          hourly: res.hourly
        };
      console.log('forecast' , this.forecast);
      });

    } catch (err) {
      console.error('Errore:', err);
      alert((err instanceof Error) ? err.message : 'Errore sconosciuto');
    }
  }

  convertDateToWeekday(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', { weekday: 'long' });
  }

  selectDate(date: string) {
    this.selectedDate = date;

      if (this.selectedDate && this.forecast?.hourly) {
        const hourly = this.forecast.hourly;

        const indexes = hourly.time
          .map((datetime, index) => datetime.startsWith(date) ? index : -1)
          .filter(index => index !== -1);

        this.daySelected = {
          time: indexes.map(i => hourly.time[i]),
          weathercode: indexes.map(i => hourly.weathercode[i]),
          apparent_temperature: indexes.map(i => hourly.apparent_temperature[i]),
        };
        console.log('daySelected', this.daySelected);
      }
  }

  selectHour(hour: string) {
    this.selectedHour = hour;

    if(this.selectedHour && this.forecast?.hourly){
      const hourIndex = this.forecast.hourly.time.findIndex(h => h == hour);

      this.hourSelected = {
          time: this.forecast.hourly.time[hourIndex],
          temperature_2m: this.forecast.hourly.temperature_2m[hourIndex],
          apparent_temperature: this.forecast.hourly.apparent_temperature[hourIndex],
          windspeed_10m: this.forecast.hourly.windspeed_10m[hourIndex],
          precipitation_probability: this.forecast.hourly.precipitation_probability[hourIndex],
          uv_index: this.forecast.hourly.uv_index[hourIndex],
        };
        console.log('hourSelected', this.hourSelected);

    }

  }

  getIcon(code: number | string){
   return this.utils.getIcon(code)
  }
}
