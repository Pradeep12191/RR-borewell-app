import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BitLife } from 'src/app/models/BitLife';
import { Location } from '@angular/common';

@Component({
    templateUrl: './hammer-life.component.html',
    styleUrls: ['./hammer-life.component.scss']
})
export class HammerLifeComponent implements OnDestroy, OnInit {
    routeDataSubscription: Subscription;
    hammerLifes: BitLife[]
    constructor(
        private route: ActivatedRoute,
        private location: Location
    ) {

    }

    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.hammerLifes = data.hammers
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    backToBit() {
        this.location.back()
    }

}