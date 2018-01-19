import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  logsRoot = 'LogsPage'
  statisticsRoot = 'StatisticsPage'

  constructor(public navCtrl: NavController) {}

}
