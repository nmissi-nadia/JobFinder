import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true,
    pure: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 150, ellipsis: string = '...'): string {
        if (!value) return '';

        if (value.length <= limit) {
            return value;
        }

        return value.substring(0, limit).trim() + ellipsis;
    }
}
