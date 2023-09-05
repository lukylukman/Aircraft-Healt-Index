import { BehaviorSubject } from 'rxjs';
import { LocalStorageServiceInterface } from './interfaces/localstorage.service.interface';

interface PersonalInformation {
  email: string;
  personalTitle: string;
  personalName: string;
  personalNumber: string;
  personalUnit: string;
}

export abstract class CoreComponent {
  isScrolled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  localStorage: LocalStorageServiceInterface;

  onScroll(event: any) {
    const verticalOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (verticalOffset > 48) {
      this.isScrolled$.next(false);
    } else {
      this.isScrolled$.next(true);
    }
  }
}
