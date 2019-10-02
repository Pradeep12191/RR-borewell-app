import { Subject } from 'rxjs';

export class CommonService {
    toggleSidenav$ = new Subject<any>();
    scrollTop$ = new Subject<any>();
    blockScroll$ = new Subject<boolean>();

    scrollTop() {
        this.scrollTop$.next();
    }

    scrollTopObs() {
        return this.scrollTop$.asObservable();
    }

    toggleSidenav() {
        this.toggleSidenav$.next();
    }

    toggleSidenavObs() {
        return this.toggleSidenav$.asObservable();
    }

    blockScrollObs() {
        return this.blockScroll$.asObservable();
    }

    blockScroll(value) {
        this.blockScroll$.next(value)
    }
}