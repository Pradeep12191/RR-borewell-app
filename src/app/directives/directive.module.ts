import { NgModule } from '@angular/core';
import { PositiveNumberDirective } from './onlyPositiveNumber.directive';
import { CommonModule } from '@angular/common';
import { ScrollToInvalidDirective } from './scroll-to-invalid.directive';
import { EnterFocusJumpDirective } from './enterFocusJump.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
        PositiveNumberDirective,
        ScrollToInvalidDirective,
        EnterFocusJumpDirective
    ],
    exports: [
        PositiveNumberDirective,
        ScrollToInvalidDirective,
        EnterFocusJumpDirective
    ]
})
export class DirectiveModule {

}