import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeroIconModule } from 'ng-heroicon';
import { UserSoeService } from '../core/services/user.soe.service';
import { NoDataComponent } from './error/no-data/no-data.component';
import { MainComponent } from './layout/main/main.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TitleCasePipe } from './pipes/title-case.pipe';
import { TransformAcronymPipe } from './pipes/transform-acronym.pipe';
import { AccordionComponent } from './reuseable-ui-components/accordion/accordion.component';
import { AccordionItemComponent } from './reuseable-ui-components/accordion/components/accordion-item/accordion-item.component';
import { AlertComponent } from './reuseable-ui-components/alert/alert.component';
import { ButtonToggleComponent } from './reuseable-ui-components/button-toggle/button-toggle.component';
import { ButtonComponent } from './reuseable-ui-components/button/button.component';
import { ChipComponent } from './reuseable-ui-components/chip/chip.component';
import { DropdownComponent } from './reuseable-ui-components/dropdown/dropdown.component';
import { FooterPaginationComponent } from './reuseable-ui-components/footer-pagination/footer-pagination.component';
import { HeaderbarComponent } from './reuseable-ui-components/headerbar/headerbar.component';
import { InputComponent } from './reuseable-ui-components/input/input.component';
import { LoadingComponent } from './reuseable-ui-components/loading/loading.component';
import { ModalComponent } from './reuseable-ui-components/modal/modal.component';
import { RadioButtonComponent } from './reuseable-ui-components/radio-button/radio-button.component';
import { SelectComponent } from './reuseable-ui-components/select/select.component';
import { StepperContentComponent } from './reuseable-ui-components/stepper/components/stepper-content/stepper-content.component';
import { StepperComponent } from './reuseable-ui-components/stepper/stepper.component';
import { TabItemComponent } from './reuseable-ui-components/tab/components/tab-item/tab-item.component';
import { TabComponent } from './reuseable-ui-components/tab/tab.component';
import { TooltipModule } from './reuseable-ui-components/tooltip/tooltip.module';
import { SvgIconComponent } from './reuseable-ui-components/svg/svg.component';
import { LayoutAdminComponent } from './layout/layout-admin/layout-admin.component';
import { SidebarAdminComponent } from './layout/sidebar-admin/sidebar-admin.component';

@NgModule({
  declarations: [
    MainComponent,
    SidebarComponent,
    TitleCasePipe,
    TransformAcronymPipe,
    HeaderbarComponent,
    InputComponent,
    SidebarAdminComponent,
    LayoutAdminComponent,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    ButtonComponent,
    ButtonToggleComponent,
    ChipComponent,
    DropdownComponent,
    LoadingComponent,
    ModalComponent,
    RadioButtonComponent,
    SelectComponent,
    StepperComponent,
    StepperContentComponent,
    NoDataComponent,
    FooterPaginationComponent,
    TabComponent,
    TabItemComponent,
    NoDataComponent,
    SvgIconComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    HeroIconModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    MainComponent,
    HeaderbarComponent,
    SidebarComponent,
    InputComponent,
    ModalComponent,
    ButtonComponent,
    StepperComponent,
    StepperContentComponent,
    DropdownComponent,
    RadioButtonComponent,
    FooterPaginationComponent,
    TabComponent,
    TabItemComponent,
    NoDataComponent,
    SvgIconComponent,
  ],
  providers: [UserSoeService],
})
export class SharedModule {}
