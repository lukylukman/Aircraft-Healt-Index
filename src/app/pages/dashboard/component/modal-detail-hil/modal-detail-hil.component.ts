import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subject, catchError, of, takeUntil, tap } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { DashboardFeatureState } from '../../states/dashboard.feature';
import { Store } from '@ngrx/store';
import { DashboardState } from '../../states/dashboard.selector';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DashboardService } from '../../dashboard.service';
import * as DashboardAction from '../../states/dashboard.action'

@Component({
  selector: 'app-modal-detail-hil',
  templateUrl: './modal-detail-hil.component.html',
  styleUrls: ['./modal-detail-hil.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.4s', style({ opacity: 0 }))]),
    ]),
    trigger('scaleAnimation', [
      state(
        'true',
        style({
          transform: 'scale(1.10)', // Scale to 105%
        })
      ),
      state(
        'false',
        style({
          transform: 'scale(1)', // Default scale (100%)
        })
      ),
      transition('false => true', animate('200ms ease-out')),
      transition('true => false', animate('200ms ease-out')),
    ]),
  ],
})
export class ModalDetailHilComponent implements OnInit {
  private readonly unsubscribe$ = new Subject();
  
  dashboardState$: Observable<DashboardFeatureState>;
  logger: LoggerService;

  @Output() formSubmitEmitted: EventEmitter<any> = new EventEmitter();
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly store: Store,
  ) { 
    this.dashboardState$ = this.store.select(DashboardState);
  }

  activeTab: number = 1;

  showTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  isTabVisible(tabNumber: number): boolean {
    return this.activeTab === tabNumber;
  }

  ngOnInit() {
  }

  openCardDetail(aircraftRegristration: string): void {
    this.store.dispatch(DashboardAction.onClearShowMoreDetailHil());

    this.dashboardService
      .getShowMoreHil(aircraftRegristration)
      .pipe(
        tap((result) => {
          // Handle response
          this.store.dispatch(DashboardAction.onLoadShowMoreDetailHil(result.data));
          console.log(result.data);
        }),
        catchError((err) => {
          console.error(err);
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  resetModal() {}
}
