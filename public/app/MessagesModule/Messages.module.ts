import { NgModule } from '@angular/core';

import { MessagesRoutesModule } from './Messages.routes.module';

import { MessagesComponent } from './components/Message.component';


@NgModule({
    imports: [ MessagesRoutesModule ],
    declarations: [ MessagesComponent ]
})
export class MessagesModule { }
