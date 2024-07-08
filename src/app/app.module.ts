import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
// import filepond module
import { FilePondModule } from 'ngx-filepond';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, FilePondModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {
}
