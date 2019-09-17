import { Component, Input } from '@angular/core';
import { Godown } from '../../Godown';

@Component({
    selector: 'confirm-pipe',
    templateUrl: './confirm-pipe.component.html',
    styleUrls: ['./confirm-pipe.component.scss']
})
export class ConfirmPipeComponent{
    @Input('formValue') pipeData;
    @Input('godown') godown: Godown;
    @Input() pipes;

    pipeAddedDisplay(pipe) {
        if(pipe){
            let start = pipe.start ? +pipe.start : 0;
            const end = pipe.end ? +pipe.end : 0;
            if (start === end) {
                return start;
            }
            return `(${start} - ${end})`;
        }
        return '0'
        
    }
}