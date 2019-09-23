import { trigger, state, transition, style, animate } from '@angular/animations';

export const FADE_OPACTIY_ANIMATION = trigger('fadeOpactiy', [transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s', style({ opacity: 1 })),
])])