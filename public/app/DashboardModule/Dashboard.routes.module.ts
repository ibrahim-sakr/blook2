import { NgModule }           from '@angular/core';
import { RouterModule }       from '@angular/router';
// -------------------------------------------------------------------------------
import { DashboardComponent } from './components/Dashboard.component';
// -------------------------------------------------------------------------------

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'dashboard', component: DashboardComponent },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutesModule { }
