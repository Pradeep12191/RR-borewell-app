import { HostListener, Directive, Input, QueryList, ElementRef } from '@angular/core';
import { MatSelect, MatInput } from '@angular/material';

@Directive({
    selector: '[enterFocusJump]'
})
export class EnterFocusJumpDirective {
    _elems;
    @Input('enterFocusJump') focusInputs: QueryList<ElementRef>;
    @Input() nativeInputs: QueryList<ElementRef | MatSelect | MatInput>;
    @Input() matInputs: QueryList<MatInput>;
    @Input() matSelects: QueryList<MatSelect>;
    @HostListener('keyup.enter', ['$event']) onEnter($event: KeyboardEvent) {
        const target = ($event.target as HTMLElement);
        const focusIndex = target.getAttribute('focusIndex') ? +target.getAttribute('focusIndex') : null;
        let nextControl
        if (focusIndex || focusIndex === 0) {
            nextControl = this.focusInputs.toArray()[focusIndex + 1]
        }
        if (nextControl) {
            if (nextControl instanceof MatSelect) {
                nextControl.focus();
                nextControl.open();
            } else if (nextControl instanceof MatInput) {
                nextControl.focus()
            }else if(nextControl instanceof ElementRef){
                nextControl.nativeElement.focus();
            }
        }
    }
}