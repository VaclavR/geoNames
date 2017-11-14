import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './home/detail/detail.component';
import { HomeService } from './home/home.service';
import { SortService } from './home/sort.service';
import { FilterService } from './home/filter.service';
import { ShortenPipe } from './shorten.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ShortenPipe,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    HomeService,
    SortService,
    FilterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
