import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DateRangePage } from './date-range';

@NgModule({
  declarations: [
    DateRangePage,
  ],
  imports: [
    IonicPageModule.forChild(DateRangePage),
  ],
})
export class DateRangePageModule {}
