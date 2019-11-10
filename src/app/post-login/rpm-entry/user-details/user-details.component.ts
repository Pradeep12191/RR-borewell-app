import { Component, Input, OnInit, ViewChildren, QueryList, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
    @Input() form;
    @Input() dateSelected: Subject<boolean>;
    @Output() lastEnter = new EventEmitter();
    dateSelectedSubcription: Subscription;
    @ViewChildren('user') userInputs: QueryList<ElementRef>;

    ngOnInit() {
        this.dateSelectedSubcription = this.dateSelected.subscribe(() => {
            // have to jump to control that dont have value
            this.jumpTo(0)
        })
    }

    ngOnDestroy() {
        if (this.dateSelectedSubcription) { this.dateSelectedSubcription.unsubscribe() }
    }

    jumpTo(index) {
        const elRef = this.userInputs.toArray()[index];
        if (elRef) {
            if (elRef.nativeElement.value) {
                return this.jumpTo(++index)
            }
            return (elRef.nativeElement as HTMLInputElement).focus();
        }
        return this.lastEnter.next();
    }
}