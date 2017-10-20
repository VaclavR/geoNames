import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Country } from '../Shared/country.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';

@Injectable()
export class HomeService {
  searchEmitted = new Subject<string>();
  private url = 'http://api.geonames.org/countryInfoJSON?';
  countries: Country[];
  currentList: Country[];

  constructor(private httpClient: HttpClient) { }

  getData(): Observable<Country[]> {
    const req = new HttpRequest('GET', this.url, {
      reportProgress: true,
      params: new HttpParams().set('username', 'vencator')
    });
    return this.httpClient.request(req)
    // return this.httpClient.get<any[]>(this.url, {
    //   observe: 'body',
    //   responseType: 'json',
    //   params: new HttpParams().set('username', 'vencator')
    // })
      .do(data =>  {
        if(data.type === 3) {
          console.log(data['loaded']);
        }
      })
      .debounceTime(100)
      .map(
        (data) => {
          this.countries = data['body'].geonames;
          return data['body'].geonames;
        }
      );
  }



  getCountryDetail(countryCode: string): Observable<Country> {
    let params = new HttpParams();
    params = params.append('username', 'vencator');
    params = params.append('country', countryCode);
    return this.httpClient.get<any[]>(this.url, {
      params: params
      // params: new HttpParams().set('username', 'vencator').set('country', countryCode)
    })
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
