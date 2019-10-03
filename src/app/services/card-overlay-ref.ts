import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable, Optional } from '@angular/core';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';

@Injectable()
export class CardOverlayref {
    private afterClosed = new Subject();
    afterClosed$ = this.afterClosed.asObservable();
    constructor(
        private overlayRef: OverlayRef,
        @Optional() private common: CommonService
    ) {

    }

    close(data?): void {
        this.common.blockScroll(false);
        this.overlayRef.dispose();
        this.afterClosed.next(data)
        this.afterClosed.complete();
    }


}