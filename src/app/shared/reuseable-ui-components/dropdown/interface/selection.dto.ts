import { FormControl } from '@angular/forms';

export interface SelectionFormDTO {
  id: FormControl<string>;
  name: FormControl<string>;
  value?: FormControl<any>;
}

export interface SelectionDTO {
  id: number;
  name: string;
  value?: any;
}
