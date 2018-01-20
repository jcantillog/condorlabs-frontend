import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, ToastController} from 'ionic-angular';
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

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController,
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

  showToast(field: string){
      let toast = this.toastCtrl.create({
          message: 'Logs ordered by ' + field + ' successfully !',
          duration: 2500,
          position: 'bottom'
      });
      toast.present();
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
                  this.sortBy('Start Log Date');
              },
              error => {
                  loader.dismiss();
                  console.log(error);
              }
          );
  }

  sortBy(field: string){
      const loader = this.loadingCtrl.create({
          content: "Sorting by " + field + "..."
      });
      loader.present();
      switch (field) {
          case 'State Code':
              this.logsList.sort((a, b) => {
                  return a.cd_cebroker_state.localeCompare(b.cd_cebroker_state);
              });
              break;
          case 'Pro Code':
              this.logsList.sort((a, b) => {
                  return a.pro_cde - b.pro_cde;
              });
              break;
          case 'Profession':
              this.logsList.sort((a, b) => {
                  return a.cd_profession.localeCompare(b.cd_profession);
              });
              break;
          case 'License ID':
              this.logsList.sort((a, b) => {
                  return a.id_license.localeCompare(b.id_license);
              });
              break;
          case 'Cycle End Date':
              this.logsList.sort((a, b) => {
                  let date_one = new Date(a.dt_end);
                  let date_two = new Date(b.dt_end);
                  return date_two > date_one ? -1 : date_two < date_one ? 1 : 0;
              });
              break;
          case 'Compliance Status':
              this.logsList.sort((a, b) => {
                  return a.ds_compl_status_returned.localeCompare(b.ds_compl_status_returned);
              });
              break;
          case 'Client ID':
              this.logsList.sort((a, b) => {
                  return a.id_client_nbr.localeCompare(b.id_client_nbr);
              });
              break;
          case 'Start Log Date':
              this.logsList.sort((a, b) => {
                  let date_one = new Date(a.dt_Start_Log);
                  let date_two = new Date(b.dt_Start_Log);
                  return date_two > date_one ? -1 : date_two < date_one ? 1 : 0;
              });
              break;
          case 'End Log Date':
              this.logsList.sort((a, b) => {
                  let date_one = new Date(a.dt_end_log);
                  let date_two = new Date(b.dt_end_log);
                  return date_two > date_one ? -1 : date_two < date_one ? 1 : 0;
              });
              break;
          case 'Environment':
              this.logsList.sort((a, b) => {
                  return a.cd_environment.localeCompare(b.cd_environment);
              });
              break;
          case 'Machine':
              this.logsList.sort((a, b) => {
                  return a.cd_machine.localeCompare(b.cd_machine);
              });
              break;
      }
      loader.dismiss();
      this.setPage(1);
      this.showToast(field);
  }

  getCurrentDate(){
    const date = new Date();
    return ((date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear());
  }
}
