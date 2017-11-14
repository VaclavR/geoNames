import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  countryCode: string;
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
    this.homeService.home = false;
    this.route.params.subscribe((params: Params) => {
      this.countryCode = params.id.toUpperCase();
      if (this.homeService.countries) {
        this.homeService.currentCountryId = this.homeService.getIndexOfCountry(this.countryCode);
      } else {
        setTimeout(() => {
          this.homeService.currentCountryId = this.homeService.getIndexOfCountry(this.countryCode);
        }, 400);
      }
    });
    // const countryCode = this.route.snapshot.params['id'].toUpperCase();
    this.subscription = this.homeService.searchEmitted
      .subscribe((cc: string) => {
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
      this.country = this.homeService.returnCountry(this.countryCode);
      this.wikilizedCountryName = this.country.countryName.replace(/[ [\]]/g, this.replacer);
    } else {
      this.homeService.getCountryDetail(this.countryCode)
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
