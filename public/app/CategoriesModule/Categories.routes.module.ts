import { NgModule }            from '@angular/core';

import { RouterModule }        from '@angular/router';

import { CategoriesComponent } from './components/Categories.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'categories/:type', component: CategoriesComponent },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CategoriesRoutesModule { }
