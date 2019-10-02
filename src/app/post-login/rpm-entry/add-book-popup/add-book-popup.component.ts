import { Component } from '@angular/core';
import { SCALE_UP_ANIMATION } from '../../../animations/scale-up.animaion';
import { CardOverlayref } from '../../../services/card-overlay-ref';
import { ConfigService } from '../../../services/config.service';

@Component({
    templateUrl: './add-book-popup.component.html',
    styleUrls: ['./add-book-popup.component.scss'],
    animations: [SCALE_UP_ANIMATION]
})
export class AddBookPopupComponent {
    appearance;
    bookCount;
    constructor(
        private overlayRef: CardOverlayref,
        private config: ConfigService
    ) {
        this.appearance = this.config.getConfig('formAppearance')
    }

    close() {
        this.overlayRef.close()
    }
}