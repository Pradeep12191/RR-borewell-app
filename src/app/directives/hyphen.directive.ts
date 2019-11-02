import { Directive, ViewContainerRef, TemplateRef, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[hyphen]'
})
export class HypenDirective implements OnInit {
    @Input('hyphen') value;
    @Input('hyphenElse') tplRef: TemplateRef<any>;
    constructor(
        private vc: ViewContainerRef,
        private tr: TemplateRef<any>
    ) {

    }

    ngOnInit() {
        if (!this.value || this.value === 0) {
            return this.vc.createEmbeddedView(this.tplRef)
        }
        this.vc.createEmbeddedView(this.tr)
    }
}