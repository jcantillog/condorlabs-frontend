import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController} from 'ionic-angular';
import {LogService} from "../../services/log.service";
import {LogModel} from "../../models/log.model";
import {PagerService} from "../../services/pager.service";

@IonicPage()
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html',
})
export class LogsPage implements OnInit{

  private logsList: LogModel[] = [];
  private pager: any = {};
  private pagedItems: any[];

  constructor(private loadingCtrl: LoadingController,
              private logService: LogService, private pagerService: PagerService) {
  }

  ngOnInit(){
      this.getLogs();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.logsList.length, page);
    // get current page of items
    this.pagedItems = this.logsList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

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
                  this.setPage(1);
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
