import { NgModule }              from '@angular/core';
import { RouterModule }          from '@angular/router';

import { DashboardRoutesModule } from './Dashboard.routes.module';

import { DashboardComponent }    from './components/Dashboard.component';


@NgModule({
    imports: [
        DashboardRoutesModule
    ],
    declarations: [
        DashboardComponent
    ],
    providers: []
})
export class DashboardModule { }
