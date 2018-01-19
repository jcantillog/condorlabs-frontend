import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController} from 'ionic-angular';
import {LogService} from "../../services/log.service";
import {LogModel} from "../../models/log.model";

@IonicPage()
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html',
})
export class LogsPage implements OnInit{

  private logsList: LogModel[] = [];

  constructor(private loadingCtrl: LoadingController, private logService: LogService) {
  }

  ngOnInit(){}

  getLogs(){
      const loader = this.loadingCtrl.create({
          content: "Loading logs..."
      });
      loader.present();
      this.logService.getLogs(this.getCurrentDate(), this.getCurrentDate())
          .subscribe(
              data => {
                  loader.dismiss();
                  this.logsList = data;
              },
              error => {
                  loader.dismiss();
                  console.log(error);
              }
          );
  }

  getCurrentDate(){
    const date = new Date();
    const fulldate: string = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    return fulldate;
  }
}
