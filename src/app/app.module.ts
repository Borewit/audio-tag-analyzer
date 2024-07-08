import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DragAndDropBoxComponent } from './drag-and-drop-box/drag-and-drop-box.component';
import { NgBytesPipeModule } from 'angular-pipes';

@NgModule({ declarations: [
        AppComponent,
        DragAndDropBoxComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
        NgBytesPipeModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
