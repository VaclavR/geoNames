import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';
import { Country } from '../../Shared/country.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  country: Country;
  wikilizedCountryName: string;
  errorMessage: string;

  private replacer(match) {
    if (match === '[') {
      return '(';
    }
    if (match === ']') {
      return ')';
    }
    if (match === ' ') {
      return '_';
    }
  }

  constructor(private route: ActivatedRoute,
              private homeService: HomeService) { }

  ngOnInit() {
    const countryCode = this.route.snapshot.params['id'].toUpperCase();
    this.subscription = this.homeService.searchEmitted
      .subscribe((cc) => {
        if (this.homeService.currentList) {
          this.country = this.homeService.returnCountry(cc);
          this.wikilizedCountryName = this.country.countryName.replace(/[ [\]]/g, this.replacer);
        } else {
          this.homeService.getCountryDetail(cc)
            .subscribe((country: Country) => {
              this.country = country;
              this.wikilizedCountryName = this.country.countryName.replace(/[ [\]]/g, this.replacer);
            });
        }
      });

    if (this.homeService.currentList) {
      this.country = this.homeService.returnCountry(countryCode);
      this.wikilizedCountryName = this.country.countryName.replace(/[ [\]]/g, this.replacer);
    } else {
      this.homeService.getCountryDetail(countryCode)
        .subscribe((country: Country) => {
        this.country = country;
        this.wikilizedCountryName = this.country.countryName.replace(/[ [\]]/g, this.replacer);
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
