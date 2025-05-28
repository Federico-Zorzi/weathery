import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiWeatherComponent } from './multi-weather.component';

describe('MultiWeatherComponent', () => {
  let component: MultiWeatherComponent;
  let fixture: ComponentFixture<MultiWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiWeatherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
