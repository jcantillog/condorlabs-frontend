import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpClientModule} from "@angular/common/http";

import { MyApp } from './app.component';

import {LogsPage} from "../pages/logs/logs";
import {StatisticsPage} from "../pages/statistics/statistics";

import {LogService} from "../services/log.service";
import {PagerService} from "../services/pager.service";
import {DropdownStateCodePage} from "../pages/logs/dropdown-state-code/dropdown-state-code";
import {DateRangePage} from "../pages/logs/date-range/date-range";

@NgModule({
  declarations: [
    MyApp,
    LogsPage,
    StatisticsPage,
    DropdownStateCodePage,
    DateRangePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LogsPage,
    StatisticsPage,
    DropdownStateCodePage,
    DateRangePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LogService,
    PagerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
