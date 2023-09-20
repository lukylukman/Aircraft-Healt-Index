import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { DashboardFeatureState } from '../../states/dashboard.feature';
import { Store } from '@ngrx/store';
import { DashboardState } from '../../states/dashboard.selector';

@Component({
  selector: 'app-modal-detail-hil',
  templateUrl: './modal-detail-hil.component.html',
  styleUrls: ['./modal-detail-hil.component.css']
})
export class ModalDetailHilComponent implements OnInit {
  private readonly unsubscribe$ = new Subject();

  
  dashboardState$: Observable<DashboardFeatureState>;
  logger: LoggerService;

  @Output() formSubmitEmitted: EventEmitter<any> = new EventEmitter();
  constructor(
    private readonly store: Store,
  ) { 
    this.dashboardState$ = this.store.select(DashboardState);
  }

  ngOnInit() {
  }

  resetModal() {}
}
