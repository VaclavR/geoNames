import { Country } from '../Shared/country.model';
import { Injectable } from '@angular/core';
import { HomeService } from './home.service';

@Injectable()
export class SortService {
  public sortDirectionAZ = {
    countryName: true,
    continentName: true,
    capital: true,
    currencyCode: true
  };
  public sortDirection09 = {
    population: true,
    areaInSqKm: true,
    density: true
  };

  constructor(private homeService: HomeService) {}

  toggleSortBy(key: string, currentList: Country[]): Country[] {
    let sortedList: Country[] = [];
    // Number sort
    if (key === 'population' || key === 'areaInSqKm' || key === 'density') {
      this.sortDirection09[key] = !this.sortDirection09[key];
      if (key === 'density') {
        if (this.sortDirection09[key]) {
          sortedList = currentList.sort(this.sortDensity09.bind(null, ['population', 'areaInSqKm']));
        } else {
          sortedList = currentList.sort(this.sortDensity90.bind(null, ['population', 'areaInSqKm']));
        }
      } else if (this.sortDirection09[key]) {
        sortedList = currentList.sort(this.sortFunction09.bind(null, key));
      } else {
        sortedList = currentList.sort(this.sortFunction90.bind(null, key));
      }
    } else {
      // Letter sort
      this.sortDirectionAZ[key] = !this.sortDirectionAZ[key];
      if (this.sortDirectionAZ[key]) {
        sortedList = currentList.sort(this.sortFunctionAZ.bind(null, key));
      } else {
        sortedList = currentList.sort(this.sortFunctionZA.bind(null, key));
      }
    }

    this.homeService.currentList = sortedList;
    return sortedList;
  }

  private sortFunctionAZ(sortKey, c1: Country, c2: Country) {
    if (c1[sortKey] < c2[sortKey]) {
      return 1;
    } else if (c1[sortKey] === c2[sortKey]) {
      return 0;
    } else {
      return -1;
    }
  }

  private sortFunctionZA(sortKey: string, c1: Country, c2: Country) {
    if (c1[sortKey] > c2[sortKey]) {
      return 1;
    } else if (c1[sortKey] === c2[sortKey]) {
      return 0;
    } else {
      return -1;
    }
  }

  private sortFunction09(sortKey: string, c1: Country, c2: Country) {
    return Number(c1[sortKey]) - Number(c2[sortKey]);
  }

  private sortFunction90(sortKey: string, c1: Country, c2: Country) {
    return Number(c2[sortKey]) - Number(c1[sortKey]);
  }

  sortDensity09(sortKey: string[], c1: Country, c2: Country) {
    return Number(c1[sortKey[0]] / c1[sortKey[1]]) - Number(c2[sortKey[0]] / c2[sortKey[1]]);
  }

  sortDensity90(sortKey: string[], c1: Country, c2: Country) {
    return Number(c2[sortKey[0]] / c2[sortKey[1]]) - Number(c1[sortKey[0]] / c1[sortKey[1]]);
  }

}
