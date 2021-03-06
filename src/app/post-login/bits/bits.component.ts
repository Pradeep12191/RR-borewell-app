import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Godown } from '../pipe/Godown';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { listStateTrigger } from '../../animations';
import { Bit } from './Bit';
import { MatDialog, MatSelectChange } from '@angular/material';
import { AddBitDialogComponent } from './add-bit-dialog/add-bit-dialog.component';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../services/app.service';
import { finalize } from 'rxjs/operators';
import { Company } from './Company';
import { BitSize } from './BitSize';
import { AddBitService } from './add-bit-dialog/add-bit.service';
import { LoaderService } from '../../services/loader-service';

const BIT_LENGTH = 20;

@Component({
    templateUrl: './bits.component.html',
    styleUrls: ['./bits.component.scss'],
    animations: [listStateTrigger]
})
export class BitsComponent {
    appearance;
    selectedGodown: Godown;
    godowns: Godown[];
    godownSelectDisabled;
    loading;
    routeDataSubscription: Subscription;
    bits: Bit[];
    lastBillUrl;
    bitSizes: BitSize[];
    lastBitSerialNo;
    bitUrl;
    companies: Company[]
    constructor(
        private config: ConfigService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private http: HttpClient,
        private toastr: ToastrService,
        private auth: AuthService,
        private addBitService: AddBitService,
        private loader: LoaderService,
        private app: AppService,
        private router: Router
    ) {
        this.appearance = this.config.getConfig('formAppearance');
        this.lastBillUrl = this.config.getAbsoluteUrl('LastBitBill');
        this.bitUrl = this.config.getAbsoluteUrl('BitList');
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.companies = data.companies
            this.bitSizes = data.bitSizes;
            this.godowns = data.bitData.godowns;
            this.selectedGodown = this.godowns[0];
            setTimeout(() => {
                this.bits = data.bitData.bits;
            })

        })
    }

    updateBits(bits) {
        this.bits = bits;
    }

    viewBitData(bit: Bit) {
        this.router.navigate(['postlogin/viewBitData', bit.size, bit.type])
    }

    navigateToViewBit() {
        this.router.navigate(['viewBit'], { relativeTo: this.route })
    }

    godownChange($event: MatSelectChange) {
        this.loading = true;
        this.godownSelectDisabled = true;
        this.app.selectedGodownId = $event.value.godown_id;
        const params = new HttpParams().set('user_id', this.auth.userid).append('gudown_id', $event.value.godown_id)
        this.http.get(this.bitUrl, { params }).pipe(finalize(() => {
            this.loading = false;
            this.godownSelectDisabled = false;
        })).subscribe(bits => {
            this.updateBits(bits);
        }, (err) => {
            if (err) {
                this.toastr.error('Error while Fetching Pipe Information', null, { timeOut: 2000 })
            }
        });
    }

    openAddBit() {
        this.loader.showSaveLoader('Loading ...')
        this.addBitService.getLastBitSerial().pipe(
            finalize(() => this.loader.hideSaveLoader())
        ).subscribe((lastBitSerialNo) => {
            const dialogRef = this.dialog.open(AddBitDialogComponent, {
                width: '60vw',
                position: { top: '0px' },
                maxHeight: '100vh',
                height: '100vh',
                data: {
                    selectedGodown: this.selectedGodown,
                    companies: this.companies,
                    bitSizes: this.bitSizes,
                    lastBitSerialNo
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((bits) => {
                if (bits) {
                    this.updateBits(bits);
                    // this.selectedGodownId = this.app.selectedGodownId
                }
            });
        }, () => {
            this.toastr.error('Unable to Fetch Last Bit Serial No')
        });
    }
}