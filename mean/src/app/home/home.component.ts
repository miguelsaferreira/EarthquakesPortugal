import { Component, OnInit } from '@angular/core';
import { Earthquakes } from './earthquakes.interface';
import { EarthquakesService } from '../services/earthquakes.service';
import { MapTypeStyle } from '@agm/core';
import { StringValueNode } from 'graphql';

@Component({
  selector: 'home',  // <home></home>
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  earthquakes: Earthquakes;
  arrayOfMonths: Number[] = [];
  arrayOfYears: Number[] = [];

  // Roman number arrays
  safe: String[] = [];
  warning: String[] = [];
  danger: String[] = [];

  // google maps zoom level
  zoom: number = 6;

  // initial center position for the map
  lat: number = 39.3999;
  lng: number = -8.2245;

  // Google Maps Template goes Here
  styles: MapTypeStyle[] = [];

  constructor(private earthquake: EarthquakesService) { }

  ngOnInit() {
    this.createRange();
    this.getEarthquakes();
  }

  getEarthquakes(): void {
    this.earthquake.getEarthquakes().subscribe(
      (data: Earthquakes) => {
        this.earthquakes = data;
      }, (err: any) => console.log(err),
      () => {
        // console.log('finished getEarthquakes()');
      }
    );
  }

  getEarthquakesByDate(date: Date): void {
    this.earthquake.getEarthquakesByDate(date).subscribe(
      (data: Earthquakes) => {
        this.earthquakes = data;
      }, (err: any) => console.log(err),
      () => {
        // console.log('getEarthquakesByDate()');
      }
    );
  }

  createRange(): void {
    this.safe = ['I', 'I / II', 'II', 'II/III', 'III', 'III/IV', 'IV', 'IV/V'];
    this.warning = ['V', 'V/VI', 'VI'];
    this.danger = ['VI/VII', 'VII', 'VII/VIII', 'VIII', 'VIII/IX', 'IX', 'IX/X', 'X'];

    let currentYear = new Date().getFullYear();
    const size = currentYear - 1995;

    for (let i = 1; i <= 12; i++) {
      this.arrayOfMonths.push(i);
    }

    for (let i = size; i >= 0; i--) {
      this.arrayOfYears.push(currentYear);
      currentYear--;
    }
  }

  onSubmit(m: string, y: string): void {

    const currentYear = new Date().getFullYear();
    const month = parseInt(m, 10);
    const year = parseInt(y, 10);

    if ((month >= 1 && month <= 12) && (year >= 1995 && year <= currentYear)) {

      let date = new Date(year, month - 1);
      this.getEarthquakesByDate(date);
    }
  }

  markerIconUrl(degree: String): String {
    if (degree === '---') {
      return 'assets/icon/default_marker.png';
    } else if (this.safe.indexOf(degree) > -1) {
      return 'assets/icon/blue_marker.png';
    } else if (this.warning.indexOf(degree) > -1) {
      return 'assets/icon/yellow_marker.png';
    } else if (this.danger.indexOf(degree) > -1) {
      return 'assets/icon/red_marker.png';
    }

  }
}