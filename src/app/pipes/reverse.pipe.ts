import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'reverse'
})
export class ReversePipe implements PipeTransform {
    transform(data: any[]) {
        return (data && data.length) ? data.reverse() : [];
    }
}