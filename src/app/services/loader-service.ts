import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    loader$ = new Subject<boolean>();
    saveLoader$ = new Subject<{status: boolean; text: string}>();

    showLoader() {
        this.loader$.next(true);
    }

    hideLoader() {
        this.loader$.next(false);
    }

    showSaveLoader(text = 'Saving...') {
        this.saveLoader$.next({status: true, text});
    }

    hideSaveLoader() {
        this.saveLoader$.next({status: false, text: 'Saving...'});
    }

    loaderObs() {
        return this.loader$.asObservable();
    }

    saveLoaderObs(){
        return this.saveLoader$.asObservable();
    }
}