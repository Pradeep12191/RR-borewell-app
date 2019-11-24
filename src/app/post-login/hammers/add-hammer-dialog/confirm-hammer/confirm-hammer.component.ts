import { Component, Input } from '@angular/core';
import { Godown } from '../../../pipe/Godown';

@Component({
    selector: 'confirm-hammer',
    templateUrl: './confirm-hammer.component.html',
    styleUrls: ['./confirm-hammer.component.scss']
})
export class ConfirmHammerComponent{
    @Input('formValue') hammerData;
    @Input() godown: Godown;
    @Input() serialNos;
}