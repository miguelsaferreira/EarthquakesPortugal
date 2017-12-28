import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Earthquakes } from '../home/earthquakes.interface';


@Injectable()
export class EarthquakesService {

  constructor(public http: Http) {
  }

  getEarthquakes(): Observable<Earthquakes> {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    return this.http.get(`/api/earthquakes/date/${year}-${month}-01`)
      .map(res => res.json())
      .catch(this.catchError);
  }

  getEarthquakesByDate(date: Date): Observable<Earthquakes> {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    return this.http.get(`/api/earthquakes/date/${year}-${month}-01`)
      .map(res => res.json())
      .catch(this.catchError);
  }

  /**
   * Catch errors that are thrown by the observables
   *
   * @private
   * @param {(Response | any)} error
   * @returns
   * @memberof FootdataService
   */
  private catchError(error: Response | any) {
    console.log(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
