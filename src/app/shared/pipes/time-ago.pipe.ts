import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo',
    standalone: true,
    pure: true
})
export class TimeAgoPipe implements PipeTransform {
    transform(value: string | Date): string {
        if (!value) return '';

        const date = typeof value === 'string' ? new Date(value) : value;
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) {
            return 'il y a quelques secondes';
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        }

        const days = Math.floor(hours / 24);
        if (days < 30) {
            return `il y a ${days} jour${days > 1 ? 's' : ''}`;
        }

        const months = Math.floor(days / 30);
        if (months < 12) {
            return `il y a ${months} mois`;
        }

        const years = Math.floor(months / 12);
        return `il y a ${years} an${years > 1 ? 's' : ''}`;
    }
}
