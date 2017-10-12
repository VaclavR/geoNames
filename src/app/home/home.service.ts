import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Country } from '../Shared/country.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HomeService {
  searchEmitted = new Subject<string>();
  private url = 'http://api.geonames.org/countryInfoJSON?username=vencator';
  countries: Country[];
  currentList: Country[];

  constructor(private http: Http) { }

  getData(): Observable<Country[]> {
    return this.http.get(this.url)
      .map(
        (data) => {
          this.countries = data.json().geonames;
          return data.json().geonames;
        }
      );
  }

  getCountryDetail(countryCode: string): Observable<Country> {
    return this.http.get(`${this.url}&country=${countryCode}`)
      .map(
        (data) => {
          return data.json().geonames[0];
        }
      );
  }

  returnCountries(): Country[] {
    return this.countries.slice();
  }

  returnCountry(countryCode: string) {
    const detailCountry: Country[] = this.countries.filter((country: Country) => {
      return countryCode === country.countryCode;
    });
    return detailCountry[0];
  }
}
