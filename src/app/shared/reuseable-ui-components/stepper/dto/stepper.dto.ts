import { HeroIconName } from "ng-heroicon";

export interface StepperInterface {
  id: string;
  title: string;
  icon: HeroIconName,
  isOptional?: boolean;
}