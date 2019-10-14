import { Component, Input } from '@angular/core';
import { Godown } from '../../../pipe/Godown';
import { Bit } from '../../Bit';

@Component({
    selector: 'confirm-bit',
    templateUrl: './confirm-bit.component.html',
    styleUrls: ['./confirm-bit.component.scss']
})
export class ConfirmBitComponent{
    @Input('formValue') bitData;
    @Input() godown: Godown;
}