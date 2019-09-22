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
    @Input() bits: Bit[];

    bitAddedDisplay(bit) {
        if(bit){
            let start = bit.start ? +bit.start : 0;
            const end = bit.end ? +bit.end : 0;
            if (start === end) {
                return start;
            }
            return `(${start} - ${end})`;
        }
        return '0'
        
    }
}