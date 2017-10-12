import { Injectable } from '@angular/core';
import { Filter } from '../Shared/filter.model';
import { Country } from '../Shared/country.model';
import { HomeService } from './home.service';
import { Keys } from './keys.model';

@Injectable()
export class FilterService {
  private filters: Filter[] = [
    {
      item: 'Continent',
      subItems: [
        'all',
        'Africa',
        'Antarctica',
        'Asia',
        'Europe',
        'North America',
        'South America',
        'Oceania'
      ]
    },
    {
      item: 'Population',
      subItems: [
        'all',
        'less than 10 millions',
        '10 - 30 millions',
        '30 - 100 millions',
        '100 - 200 millions',
        '200 - 500 millions',
        'more than 500 millions',
        'custom range'
      ],
      filterKeys: [
        { min: 0, max: 10000000000},
        { min: 0, max: 9999999},
        { min: 10000000, max: 29999999},
        { min: 30000000, max: 99999999},
        { min: 100000000, max: 199999999},
        { min: 200000000, max: 499999999},
        { min: 500000000, max: 10000000000},
      ]
    },
    {
      item: 'Land Mass',
      subItems: [
        'all',
        'less than 10 000',
        '10 000 -  100 000',
        '100 000 - 500 000',
        '500 000 - 1 million',
        'more than 1 million'
      ],
      filterKeys: [
        { min: 0, max: 20000000},
        { min: 0, max: 9999},
        { min: 10000, max: 99999},
        { min: 100000, max: 499999},
        { min: 500000, max: 999999},
        { min: 1000000, max: 20000000},
      ]
    }
  ];

  private filterPreset = {
    continent: 0,
    population: 0,
    landMass: 0
  };

  constructor(private homeService: HomeService) {}

  returnActiveFiltersList() {
    const activeFiltersList: string[] = [];
    activeFiltersList.push(this.filters[0].subItems[this.filterPreset.continent]);
    activeFiltersList.push(this.filters[1].subItems[this.filterPreset.population]);
    activeFiltersList.push(this.filters[2].subItems[this.filterPreset.landMass]);
    return activeFiltersList;
  }

  returnFilters() {
    return this.filters.slice();
  }

  newFilterFunction(keys: Keys): Country[] {
    switch (keys.category) {
      case 'Continent':
        this.filterPreset.continent = keys.index;
        break;
      case 'Population':
        this.filterPreset.population = keys.index;
        break;
      case 'Land Mass':
        this.filterPreset.landMass = keys.index;
        break;
    }
    const filter = this.filterPreset;
    let filteredCountries = this.homeService.returnCountries();

    if (filter.landMass === 0 && filter.population === 0 && filter.continent === 0) {
      this.homeService.currentList = filteredCountries;
      return filteredCountries;
    }

    // Continent filter
    if (filter.continent !== 0) {
      filteredCountries = filteredCountries.filter((country: Country) => {
        return country.continentName === this.filters[0].subItems[filter.continent];
      });
    }

    // Population filter
    if (filter.population !== 0) {
      const min = this.filters[1].filterKeys[filter.population]['min'];
      const max = this.filters[1].filterKeys[filter.population]['max'];
      filteredCountries = filteredCountries.filter((country: Country) => {
        return country.population >= min && country.population <= max;
      });
    }

    // Land Mass filter
    if (filter.landMass !== 0) {
      const min = this.filters[2].filterKeys[filter.landMass]['min'];
      const max = this.filters[2].filterKeys[filter.landMass]['max'];
      filteredCountries = filteredCountries.filter((country: Country) => {
        return country.areaInSqKm >= min && country.areaInSqKm <= max;
      });
    }


    this.homeService.currentList = filteredCountries;
    return filteredCountries;
  }

}
