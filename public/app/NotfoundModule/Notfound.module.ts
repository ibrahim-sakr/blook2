import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/Notfound.component'


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'not_found', component: NotfoundComponent }
        ])
    ],
    declarations: [
        NotfoundComponent
    ],
    providers: []
})
export class NotfoundModule { }
