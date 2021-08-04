import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as createDebug from 'debug';

const debug = createDebug('audio-tag-analyzer:app');

localStorage.debug = '-sockjs-client:*,*';

createDebug('Logging enabled');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
