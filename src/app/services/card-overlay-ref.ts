import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable, Optional } from '@angular/core';
import { CommonService } from './common.service';

@Injectable()
export class CardOverlayref {
    constructor(
        private overlayRef: OverlayRef,
        @Optional() private common: CommonService
    ) {

    }

    close(): void {
        this.common.blockScroll(false);
        this.overlayRef.dispose();
    }
}