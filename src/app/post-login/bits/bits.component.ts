import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Godown } from '../pipe/Godown';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './bits.component.html',
    styleUrls: ['./bits.component.scss']
})
export class BitsComponent {
    appearance;
    selectedGodown: Godown;
    godowns: Godown[];
    godownSelectDisabled;
    loading;
    routeDataSubscription: Subscription;
    constructor(
        private config: ConfigService,
        private route: ActivatedRoute
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.godowns = data.godowns;
            this.selectedGodown = this.godowns[1];
        })
    }

    navigateToViewBill(){

    }

    godownChange(){
        
    }
}