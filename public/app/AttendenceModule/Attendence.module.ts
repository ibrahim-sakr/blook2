import { NgModule } from '@angular/core';

import { AttendenceRoutesModule } from './Attendence.routes.module';

import { AttendenceComponent } from './components/Attendence.component';

@NgModule({
    imports: [
        AttendenceRoutesModule
    ],
    declarations: [
        AttendenceComponent
    ],
    providers: []
})
export class AttendenceModule { }
