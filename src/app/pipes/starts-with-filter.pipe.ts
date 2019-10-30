import { Pipe, PipeTransform } from '@angular/core';

type prop = string | any[];

@Pipe({
    name: 'startsWithFilter'
})
export class StartsWithFilterPipe implements PipeTransform {
    transform(array: string[], searchTerm = '',
        propName: prop, type: 'startsWith' | 'in' = 'startsWith'
    ) {
        if (array && array.length) {
            if (typeof propName === 'string') {
                return array.filter(item => item[propName].toString().startsWith(searchTerm))
            }

            if (Array.isArray(propName)) {
                if (!searchTerm) {
                    return array;
                }
                return array.filter((value) => {
                    const searchText: string = propName.reduce((acc, current) => {
                        if (+value[current]) {
                            return acc + value[current]
                        }
                        return acc + ''
                    }, '');
                    if (searchText) {
                        return searchText.toLowerCase().search(searchTerm.toLowerCase()) !== -1;
                    }
                    return false;
                })
            }
        }
        return []
    }
}