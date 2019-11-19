import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'convertHours'
})
export class ConvertHours implements PipeTransform {
    transform(hrs = 0, min = 0) {
        const totalMin = hrs * 60 + min;
        const actualHrs = Math.floor(totalMin / 60);
        const actualMins = totalMin % 60;
        return `${actualHrs} hrs ${actualMins} min`
    }
}