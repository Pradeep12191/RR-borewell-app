import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BitLife } from 'src/app/models/BitLife';
import { Location } from '@angular/common';

@Component({
    templateUrl: './bit-life.component.html',
    styleUrls: ['./bit-life.component.scss']
})
export class BitLifeComponent implements OnDestroy, OnInit {
    routeDataSubscription: Subscription;
    bitLifes: BitLife[]
    constructor(
        private route: ActivatedRoute,
        private location: Location
    ) {

    }

    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.bitLifes = data.bits
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    backToBit() {
        this.location.back()
    }

}