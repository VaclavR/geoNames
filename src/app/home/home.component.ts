import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { FilterService } from './filter.service';
import { SortService } from './sort.service';
import { Filter } from '../Shared/filter.model';
import { Country } from '../Shared/country.model';
import { Keys } from './keys.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  showSortArrow = {
    countryName: true,
    continentName: false,
    capital: false,
    density: false,
    currencyCode: false,
    population: false,
    areaInSqKm: false
  };
  filters: Filter[];
  activeFilters: string[];
  countries: Country[];
  currentList: Country[];

  constructor(private homeService: HomeService,
              private filterService: FilterService,
              public sortService: SortService) { }

  ngOnInit() {
    this.activeFilters = this.filterService.returnActiveFiltersList();
    this.filters = this.filterService.returnFilters();
    if (this.homeService.currentList) {
      this.countries = this.homeService.currentList;
      this.currentList = this.countries;
    }
  }

  onEngage() {
    this.isLoading = true;
    setTimeout(this.getCountries.bind(this), 100);
  }

  getCountries() {
    this.countries = this.homeService.returnCountries();
    this.currentList = this.sortService.toggleSortBy('countryName', this.countries);
    this.isLoading = false;
  }

  filterBy(keys: Keys) {
    this.currentList = this.filterService.newFilterFunction(keys);
    this.activeFilters = this.filterService.returnActiveFiltersList();
  }

  toggleSortBy(key: string) {
    Object.entries(this.showSortArrow).forEach(
      ([arrow]) => {
        this.showSortArrow[arrow] = arrow === key;
      }
    );
    this.currentList = this.sortService.toggleSortBy(key, this.currentList);
  }

}
