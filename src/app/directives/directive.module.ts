import { NgModule } from '@angular/core';
import { PositiveNumberDirective } from './onlyPositiveNumber.directive';
import { CommonModule } from '@angular/common';
import { ScrollToInvalidDirective } from './scroll-to-invalid.directive';
import { EnterFocusJumpDirective } from './enterFocusJump.directive';
import { HypenDirective } from './hyphen.directive';

@NgModule({
    imports: [CommonModule],
    declarations: [
        PositiveNumberDirective,
        ScrollToInvalidDirective,
        EnterFocusJumpDirective,
        HypenDirective
    ],
    exports: [
        PositiveNumberDirective,
        ScrollToInvalidDirective,
        EnterFocusJumpDirective,
        HypenDirective
    ]
})
export class DirectiveModule {

}