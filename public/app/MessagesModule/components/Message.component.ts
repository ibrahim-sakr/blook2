import { Component, ViewEncapsulation, trigger, transition, animate, style, state } from '@angular/core';
import { Location } from '@angular/common';
import { OnInit } from '@angular/core';


@Component({
    selector: 'messages',
    templateUrl: 'app/MessagesModule/views/messages.html',
    styleUrls: ['app/MessagesModule/css/messages.css'],
    encapsulation: ViewEncapsulation.Emulated,
    host: { '[@messagesHostAnimate]': 'true' },
    animations: [
        trigger('messagesContainerAnimate', [
            state('active', style({
                right: 0
            })),
            transition('void <=> active', animate('100ms linear')),
        ]),
        trigger('messagesHostAnimate', [
            state('*', style({
                backgroundColor: '#000',
            })),
            transition('* <=> void', animate('100ms linear')),
        ])
    ]
})
export class MessagesComponent implements OnInit {
    messagesContainerAnimateTrigger = 'void';

    constructor(private location: Location) { }

    ngOnInit(): void {
        this.messagesContainerAnimateTrigger = 'active';
    }

    goBack(): void {
        this.messagesContainerAnimateTrigger = 'void';
        this.location.back();
    }
}
