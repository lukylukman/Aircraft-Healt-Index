import { Injectable } from '@angular/core';
import {
  add,
  differenceInBusinessDays,
  differenceInDays,
  format,
} from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DateUtil {
  getCountDaysBetweenTwoDates(startDate?: string, endDate?: string): number {
    const date1: Date = startDate ? new Date(startDate) : new Date();
    const date2: Date = new Date(endDate);
    return differenceInDays(date1, date2);
  }

  getPercentage(startDate?: string, endDate?: string): number {
    const date1: Date = startDate ? new Date(startDate) : new Date();
    const date2: Date = new Date(endDate);

    return differenceInBusinessDays(date1, date2);
  }

  padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date): string {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    return formattedDate;
  }

  addDateByDay(addDay: number): string {
    const currentDate = new Date();
    const futureDate = add(currentDate, { days: addDay });
    const formattedDate = format(futureDate, 'yyyy-MM-dd HH:mm:ss');
    // console.log('currentFormattedDate > ', formattedDate);
    return formattedDate.replace(' ', 'T');
  }
}
