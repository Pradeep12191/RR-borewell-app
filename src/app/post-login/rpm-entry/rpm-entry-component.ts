import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PipeSize } from '../../models/PipeSize';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
    templateUrl: './rpm-entry-component.html',
    styleUrls: ['./rpm-entry-component.scss']
})
export class RpmEntryComponent implements OnInit, OnDestroy {
    rpmEntry = {
        previousStockFT: [],
        rrIncome: [],
        mmIncome: [],
        availableStock: [],
        pointExpenseFeet: [],
        balanceStockFeet: []
    }
    routeDataSubscription: Subscription;
    pipeTotalFlex = 80;
    pipeFlex = 10;
    pipes: PipeSize[];
    form: FormGroup;


    get pointExpenseFeetFormArray() {
        return this.form.get('pointExpenseFeet') as FormArray
    }

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            pointExpenseFeet: this.fb.array([])
        })
    }


    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.pipes = data.pipes
            this.pipeFlex = this.pipeTotalFlex / this.pipes.length;
            this.pipeFlex = Math.round(this.pipeFlex * 100) / 100;

            this.pipes.forEach(pipe => {
                const pipeData = { pipeType: pipe.type, value: '' }
                this.rpmEntry.previousStockFT.push(pipeData);
                this.rpmEntry.rrIncome.push(pipeData);
                this.rpmEntry.mmIncome.push(pipeData);
                this.rpmEntry.balanceStockFeet.push(pipeData);
                this.rpmEntry.availableStock.push(pipeData);
                this.pointExpenseFeetFormArray.push(this.buildPointExpenseForm(pipe.type))
            })
        })
    }

    ngOnDestroy() {
        if (this.routeDataSubscription) { this.routeDataSubscription.unsubscribe() }
    }

    private buildPointExpenseForm(pipeType) {
        return this.fb.group({ pipeType, value: '' })
    }

    save() {
        const pointExpenseFeet = this.form.value.pointExpenseFeet
        this.rpmEntry.pointExpenseFeet = pointExpenseFeet;
        console.log(JSON.stringify(this.rpmEntry, null, 2))
    }
}