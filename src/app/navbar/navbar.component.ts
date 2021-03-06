import { Component, HostListener, OnInit } from '@angular/core';
import { Country } from '../Shared/country.model';
import { HomeService } from '../home/home.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchForm: FormGroup;
  placeholder = 'country name';
  countries: Country[];
  private countryCode: string;

  constructor(private homeService: HomeService,
              private router: Router) { }

  ngOnInit() {

    this.homeService.getData()
      .subscribe((countries: Country[]) => {
        this.countries = countries;
        this.searchForm = new FormGroup({
          'country': new FormControl(null, [Validators.required, this.allowedCountryNames.bind(this)])
        });
        this.searchForm.statusChanges.subscribe((status) => {
          if (status === 'VALID') {
            this.findCountry(this.searchForm.value.country);
            this.searchForm.reset();
          }
        });
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.homeService.home) {
      if (event.keyCode === 37) {
        this.onLoadCountry('prev');
      }
      if (event.keyCode === 39) {
        this.onLoadCountry('next');
      }
    }
  }

  onLoadCountry(direction: string) {
    this.homeService.returnNextOrPrevCountry(direction);
    this.router.navigate(['/country', this.homeService.countryCode]);
  }

  onInput() {
    if (this.searchForm.valid) {
      this.findCountry(this.searchForm.value.country);
      this.searchForm.reset();
    }
  }

  private findCountry(countryName: string) {
    const pos = this.countries.findIndex((country) => {
      return country.countryName.toLowerCase() === countryName.toLowerCase();
    });
    this.countryCode = this.countries[pos].countryCode;
    this.router.navigate(['/country', this.countryCode]);
    this.homeService.searchEmitted.next(this.countryCode);
  }

  private allowedCountryNames(control: FormControl): {[s: string]: boolean} {
    if (typeof control.value === 'string') {
      const pos = this.countries.findIndex((country) => {
        return country.countryName.toLowerCase() === control.value.toLowerCase();
      });
      if (pos === -1) {
        return {'nameIsNotAllowed': true};
      }
      return null;
    }
  }

}
