import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'todolist-root',
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None
})
export class TodolistRootComponent { }
