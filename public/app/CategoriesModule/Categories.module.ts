import { NgModule } from '@angular/core';

import { CategoriesRoutesModule } from './Categories.routes.module';

import { CategoriesComponent } from './components/Categories.component';


@NgModule({
    imports: [
        CategoriesRoutesModule
    ],
    declarations: [
        CategoriesComponent
    ],
    providers: []
})
export class CategoriesModule { }
