import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusLabel',
    standalone: true,
    pure: true
})
export class StatusLabelPipe implements PipeTransform {
    transform(value: string): string {
        const statusMap: { [key: string]: string } = {
            'en_attente': 'En attente',
            'accepte': 'Accepte',
            'refuse': 'Refuse'
        };

        return statusMap[value] || value;
    }
}
