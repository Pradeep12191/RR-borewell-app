import { OverlayRef } from '@angular/cdk/overlay';

export class CardOverlayref {
    constructor(
        private overlayRef: OverlayRef
    ) {

    }

    close(): void {
        this.overlayRef.dispose();
    }
}