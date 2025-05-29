import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MultiWeatherComponent } from './multi-weather/multi-weather.component'
import { SearchWeatherComponent } from './search-weather/search-weather.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MultiWeatherComponent, SearchWeatherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'weather-app';
}
