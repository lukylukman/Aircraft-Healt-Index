import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [TooltipDirective, TooltipComponent],
  imports: [CommonModule],
  exports: [TooltipDirective],
})
export class TooltipModule {}
