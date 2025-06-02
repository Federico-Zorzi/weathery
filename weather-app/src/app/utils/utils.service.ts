import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
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

  getIcon(code: number | string): string {
    const numericCode = typeof code === 'string' ? parseInt(code, 10) : code;
    return this.weatherCodeIcons[numericCode] ?? '❓';
  }
}
