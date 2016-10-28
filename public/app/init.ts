import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode }         from '@angular/core';
import { BlookModule }            from './BlookModule/Blook.module';

const platform = platformBrowserDynamic();

// enableProdMode();
platform.bootstrapModule(BlookModule);
