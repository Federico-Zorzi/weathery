import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MultiWeatherComponent } from './multi-weather/multi-weather.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MultiWeatherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'weather-app';
}
