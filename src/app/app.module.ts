import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DragAndDropBoxComponent } from './drag-and-drop-box/drag-and-drop-box.component';
import { NgBytesPipeModule } from 'angular-pipes';

@NgModule({
  declarations: [
    AppComponent,
    DragAndDropBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgBytesPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
