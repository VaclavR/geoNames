import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Country } from '../Shared/country.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HomeService {
  searchEmitted = new Subject<string>();
  private url = 'http://api.geonames.org/countryInfoJSON?username=vencator';
  countries: Country[];
  currentList: Country[];

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<Country[]> {
    return this.httpClient.get<any[]>(this.url, {
      observe: 'body',
      responseType: 'json'
    })
      .map(
        (data) => {
          console.log(data);
          this.countries = data['geonames'];
          return data['geonames'];
        }
      );
  }

  getCountryDetail(countryCode: string): Observable<Country> {
    return this.httpClient.get<any[]>(this.url + '&country=' + countryCode)
      .map(
        (response) => {
          console.log(response);
          console.log('Return Countries');
          return response['geonames'][0];
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
