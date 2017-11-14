import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Country } from '../Shared/country.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class HomeService {
  searchEmitted = new Subject<string>();
  private url = 'http://api.geonames.org/countryInfoJSON?';
  countries: Country[];
  currentList: Country[];
  countryCode: string;
  currentCountryId: number;
  home: boolean;

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<Country[]> {
    return this.httpClient.get<any[]>(this.url, {
      observe: 'body',
      responseType: 'json',
      params: new HttpParams().set('username', 'vencator')
    })
      .map(
        (data: any) => {
          this.countries = data.geonames;
          return data.geonames;
        }
      );
  }

  getCountryDetail(countryCode: string): Observable<Country> {
    let params = new HttpParams();
    params = params.append('username', 'vencator');
    params = params.append('country', countryCode);
    return this.httpClient.get<any[]>(this.url, {
      params: params
    })
      .map(
        (response) => {
          return response['geonames'][0];
        }
      );
  }

  getIndexOfCountry(countryCode: string) {
    if (this.countries) {
      return this.countries.findIndex((country: Country) => {
        return country.countryCode === countryCode;
      });
    }
  }

  returnCountries(): Country[] {
    return this.countries.slice();
  }

  returnCountry(countryCode: string) {
    const detailCountry: Country[] = this.countries.filter((country: Country) => {
      return countryCode.toUpperCase() === country.countryCode;
    });
    return detailCountry[0];
  }

  returnNextOrPrevCountry(direction: string) {
    if (direction === 'prev') {
      if (this.currentCountryId === 0) {
        this.countryCode = this.countries[this.countries.length - 1].countryCode;
      } else {
        this.countryCode = this.countries[this.currentCountryId - 1].countryCode;
      }
    }
    if (direction === 'next') {
      if (this.currentCountryId + 1 === this.countries.length) {
        this.countryCode = this.countries[0].countryCode;
      } else {
        this.countryCode = this.countries[this.currentCountryId + 1].countryCode;
      }
    }
    this.searchEmitted.next(this.countryCode);
  }
}
