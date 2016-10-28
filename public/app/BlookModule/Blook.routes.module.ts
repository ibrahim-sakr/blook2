import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
// -------------------------------------------------------------------------------

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: '/not_found' }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BlookRoutesModule { }
