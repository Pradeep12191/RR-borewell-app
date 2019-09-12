import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelectionListChange } from '@angular/material';

@Component({
    templateUrl: './assign-vehicle.component.html',
    styleUrls: ['./assign-vehicle.component.scss']
})
export class AssignVehicleComponent {
    pipes = [
        { type: '4\'\'4 kg', key: 'p_4Inch4Kg1' },
        { type: '4\'\'6 kg', key: 'p_4Inch6Kg1' },
        { type: '5\'\'6 kg', key: 'p_5Inch6Kg1' },
        { type: '5\'\'8 kg', key: 'p_5Inch8Kg1' },
        { type: '7\'\'6 kg', key: 'p_7Inch6Kg1' },
        { type: '7\'\'8 kg', key: 'p_7Inch8Kg1' },
        { type: '8\'\'4 kg', key: 'p_8Inch4Kg1' },
        { type: '11\'\'4 kg', key: 'p_11Inch4Kg1' },
    ];
    pipeName;
    selectedPipes = []

    pipeSerialNos

    constructor(
        private route: ActivatedRoute
    ) {
        this.route.paramMap.subscribe(paramMap => {
            const pipeType = paramMap.get('pipeType');
            this.pipeName = this.pipes.find(pipe => pipe.key === pipeType).type;
        })

        this.pipeSerialNos = Array.from({ length: 50 }).map((_, i) => i + 1);
    }

    onSelect($event: MatSelectionListChange) {
        if ($event.option.selected) {
            this.selectedPipes.push($event.option.value);
        } else {
            if (this.selectedPipes.indexOf($event.option.value) !== -1) {
                const i = this.selectedPipes.indexOf($event.option.value);
                this.selectedPipes.splice(i, 1);
            }
        }
    }
}