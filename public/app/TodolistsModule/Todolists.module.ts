import { NgModule }                from '@angular/core';

import { TodolistRoutesModule }    from './Todolist.routes.module';

import { TodolistRootComponent }   from './components/Todolist.root.component';
import { TodolistComponent }       from './components/Todolist.component';
import { TodolistCreateComponent } from './components/Todolist.create.component';
import { TodolistEditComponent }   from './components/Todolist.edit.component';


@NgModule({
    imports: [
        TodolistRoutesModule
    ],
    declarations: [
        TodolistRootComponent,
        TodolistComponent,
        TodolistCreateComponent,
        TodolistEditComponent
    ],
    providers: []
})
export class TodolistsModule { }
