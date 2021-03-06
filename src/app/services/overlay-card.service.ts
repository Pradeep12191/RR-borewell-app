import { Injectable, InjectionToken, Injector, ComponentRef, ElementRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { CardOverlayref } from './card-overlay-ref';
import { CommonService } from './common.service';

export const OVERLAY_CARD_DATA = new InjectionToken<any>('OVERLAY_CARD_DATA');

interface CardOverlayConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    data?: {}
}

const DEFAULT_CONFIG: CardOverlayConfig = {
    backdropClass: 'card-overlay-backdrop',
    panelClass: 'card-overlay-dialog-class',
    hasBackdrop: true
}

const DEFAULT_POSITON: ConnectedPosition[] = [{
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
}]

@Injectable()
export class OverlayCardService {
    constructor(
        private overlay: Overlay,
        private injector: Injector,
        private common: CommonService
    ) {

    }

    open<T>(component: ComponentType<T>, connectedElementRef: ElementRef, config: CardOverlayConfig = {}, poisiton: ConnectedPosition[] = DEFAULT_POSITON) {
        // this.common.blockScroll(true);
        const dialogConfig = { ...DEFAULT_CONFIG, ...config }
        const overlayRef = this.createOverlay(dialogConfig, connectedElementRef, poisiton);
        const dialoRef = new CardOverlayref(overlayRef, this.common);
        this.attachDialogContainer(component, dialogConfig, overlayRef, dialoRef);
        return dialoRef;
    }

    private getOverlayConfig(config: CardOverlayConfig, connectedElement: ElementRef, poisitons) {
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(connectedElement).withPositions(poisitons).withPush(false);

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.block(),
        })

        return overlayConfig;
    }

    private createOverlay(config: CardOverlayConfig, connectedElement: ElementRef, poisitons) {
        const overlayConfig = this.getOverlayConfig(config, connectedElement, poisitons);
        return this.overlay.create(overlayConfig);
    }

    private createInjector(config: CardOverlayConfig, dialogRef: CardOverlayref) {
        // Instantiate new WeakMap for our custom injection tokens
        const injectionTokens = new WeakMap();

        // Set custom injection tokens
        injectionTokens.set(CardOverlayref, dialogRef);
        injectionTokens.set(OVERLAY_CARD_DATA, config.data);

        // Instantiate new PortalInjector
        return new PortalInjector(this.injector, injectionTokens);
    }

    private attachDialogContainer<T>(component: ComponentType<T>, config: CardOverlayConfig, overlayRef: OverlayRef, dialogRef: CardOverlayref) {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(component, null, injector);
        const containerRef: ComponentRef<T> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

}