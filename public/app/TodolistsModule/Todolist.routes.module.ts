import { NgModule }                from '@angular/core';

import { RouterModule }            from '@angular/router';

import { TodolistRootComponent }   from './components/Todolist.root.component';
import { TodolistComponent }       from './components/Todolist.component';
import { TodolistCreateComponent } from './components/Todolist.create.component';
import { TodolistEditComponent }   from './components/Todolist.edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'todolists',
                component: TodolistRootComponent,
                children: [
                    { path: '', component: TodolistComponent },
                    { path: 'create', component: TodolistCreateComponent },
                    { path: 'edit/:id', component: TodolistEditComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TodolistRoutesModule { }
