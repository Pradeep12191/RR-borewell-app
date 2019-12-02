import { trigger, state, transition, style, animate, query, animateChild } from '@angular/animations';

export const FADE_IN_ANIMATION = trigger('fadeIn', [transition(':enter', [
    // query(':enter', [animateChild()]),
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('0.5s', style({ opacity: 1, transform: 'translateY(0px)' })),
])])