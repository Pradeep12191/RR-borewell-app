import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'startsWithFilter'
})
export class StartsWithFilterPipe implements PipeTransform {
    transform(array: string[], searchTerm = '', propName) {
        if(array && array.length){
            return array.filter(item => item[propName].toString().startsWith(searchTerm))
        }
        return []
    }
}