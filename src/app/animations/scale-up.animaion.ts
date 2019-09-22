import { trigger, state, transition, style, animate, keyframes } from '@angular/animations';

export const SCALE_UP_ANIMATION = trigger('scaleUp', [transition(':enter', [
    // style({ transform: 'scale(1.02)' }),
    animate('0.3s', keyframes([
        style({
            transform: 'scale3d(1, 1, 1)',
            offset: 0
        }),
        style({
            transform: 'scale3d(1.03, 1.03, 1.03)',
            offset: 0.5
        }),
        style({
            transform: 'scale3d(1, 1, 1)',
            offset: 1
        })
    ])),
])])