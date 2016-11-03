import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AttendenceComponent } from './components/Attendence.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'attendence', component: AttendenceComponent }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AttendenceRoutesModule { }
