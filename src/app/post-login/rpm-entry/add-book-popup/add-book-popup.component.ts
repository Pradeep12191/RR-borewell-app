import { Component, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { SCALE_UP_ANIMATION } from '../../../animations/scale-up.animaion';
import { CardOverlayref } from '../../../services/card-overlay-ref';
import { ConfigService } from '../../../services/config.service';
import { RpmEntryService } from '../rpm-entry.service';
import { OVERLAY_CARD_DATA } from '../../../services/overlay-card.service';
import { Vehicle } from '../../../models/Vehicle';

@Component({
    templateUrl: './add-book-popup.component.html',
    styleUrls: ['./add-book-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})
export class AddBookPopupComponent implements AfterViewInit {
    appearance;
    bookCount;
    vehicle: Vehicle
    @ViewChild('bookInp', { static: false, read: ElementRef }) bookInput: ElementRef
    constructor(
        private overlayRef: CardOverlayref,
        private config: ConfigService,
        private rpmEntryService: RpmEntryService,
        @Inject(OVERLAY_CARD_DATA) data
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        console.log(data);
        this.vehicle = data.vehicle;
    }

    saveBook() {
        this.rpmEntryService.postBook({
            vehicle_id: +this.vehicle.vehicle_id,
            vehicle_no: this.vehicle.regNo,
            start: this.bookCount - 99 > 0 ? this.bookCount - 99 : 0,
            end: +this.bookCount
        }).subscribe((book) => {
            this.overlayRef.close(book);
        }, (err) => {

        })

    }

    cancel() {
        this.overlayRef.close();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            (this.bookInput.nativeElement as HTMLInputElement).focus()
        })
        
    }
}