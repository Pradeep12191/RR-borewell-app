import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AppService } from '../services/app.service';


@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private app: AppService
    ) {
        console.log('error previous url', this.app.previousUrl)
    }

    reload() {
        if (this.app.previousUrl) {
            this.router.navigateByUrl(this.app.previousUrl)
        } else {
            this.router.navigate(['/postlogin/pipes'])
        }
    }
}