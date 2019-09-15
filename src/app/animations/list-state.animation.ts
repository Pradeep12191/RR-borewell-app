import { trigger, transition, query, animate, keyframes, style, stagger } from '@angular/animations';

export const listStateTrigger = trigger('listState', [
    transition('* => *', [
        query(':enter', [
            style({
                opacity: 0,
                transform: 'translateY(10px)',
            }),
            stagger(200,
                animate('1s ease-out', keyframes([    
                    style({
                        opacity: 1,
                        transform: 'translateY(-10px)',
                        offset: 0.4
                    }),
                    style({
                        opacity: 1,
                        transform: 'translateY(0px)',
                        offset: 1
                    })
                ])))

        ], { optional: true })
    ])
])