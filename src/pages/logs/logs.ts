import {Component, OnInit} from '@angular/core';
import {
    IonicPage, LoadingController, ModalController, PopoverController,
    ToastController
} from 'ionic-angular';
import {LogService} from "../../services/log.service";
import {LogModel} from "../../models/log.model";
import {PagerService} from "../../services/pager.service";
import {DropdownStateCodePage} from "./dropdown-state-code/dropdown-state-code";
import {DateRangeModel} from "../../models/date_range.model";
import {DateRangePage} from "./date-range/date-range";
import {StatisticsPage} from "../statistics/statistics";

@IonicPage()
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html',
})
export class LogsPage implements OnInit{

  private logsList: LogModel[] = [];
  private pager: any = {};
  private pagedItems: any[];
  private filterStateCode: string = "All of them";
  private dateRange: DateRangeModel = new DateRangeModel(this.getCurrentDate("MM/DD/YYYY"), this.getCurrentDate("MM/DD/YYYY"));
  private responseTime: number = 0;
  private responseTimes: number[] = [];

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              private popoverCtrl: PopoverController, private modalCtrl: ModalController,
              private logService: LogService, private pagerService: PagerService) {
  }

  ngOnInit(){
      this.getLogsBy('default');
  }

  setPage(page: number) {
    this.pager.totalPages = undefined;
    if (page < 1 || page > this.pager.totalPages) {
        console.log(page);
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.logsList.length, page);
    // get current page of items
    this.pagedItems = this.logsList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  showToast(field: string, information: boolean){
      let toast;
      switch (information) {
          case true:
              toast = this.toastCtrl.create({
                  message: 'Click on any column header in order to sort logs by that field !',
                  showCloseButton: true,
                  closeButtonText: "OK",
                  position: 'top'
              });
              break;
          case false:
              toast = this.toastCtrl.create({
                  message: 'Logs ordered by ' + field + ' successfully !',
                  duration: 2500,
                  position: 'bottom'
              });
              break;
      }
      toast.present();
  }

  showStateCodeDropdown(event: any){
      let popover = this.popoverCtrl.create(DropdownStateCodePage,{option: this.filterStateCode});
      popover.present({
          ev: event
      });
      popover.onDidDismiss(data => {
          if(data) {
              this.filterStateCode = data;
              this.getLogsBy('filters');
          }
      })
  }

  showDefaultLogsAlert(){

  }

  showStatistics(){
      let modal = this.modalCtrl.create(StatisticsPage,
          {logsList: this.logsList.slice(), responseTime: this.responseTime, responseTimes: this.responseTimes});
      modal.present();
  }

  showDateRange(){
      let modal = this.modalCtrl.create(DateRangePage,
  {start_date: this.conversorDateModelFormat(this.dateRange.start_date, "MM/DD/YYYY", "YYYY-MM-DD"),
        end_date: this.conversorDateModelFormat(this.dateRange.end_date, "MM/DD/YYYY", "YYYY-MM-DD")});
      modal.present();
      modal.onDidDismiss(data => {
          if(data){
              data.dates.start_date = this.conversorDateModelFormat(data.dates.start_date, "YYYY-MM-DD", "MM/DD/YYYY");
              data.dates.end_date = this.conversorDateModelFormat(data.dates.end_date, "YYYY-MM-DD", "MM/DD/YYYY")
              this.dateRange = data.dates;
              if(data.find){
                  this.getLogsBy('filters');
              }
          }
      })
  }

  getLogsBy(criteria: string){
      let start_date, end_date, state_code;
      const loader = this.loadingCtrl.create({
          content: "Loading logs by " + criteria + "..."
      });
      loader.present();
      switch (criteria) {
          case 'default':
              start_date = this.getCurrentDate("MM/DD/YYYY");
              end_date = this.getCurrentDate("MM/DD/YYYY");
              state_code = "LA";
              break;
          case 'filters':
              if(this.filterStateCode == "All of them") state_code = "";
              else state_code = this.filterStateCode;
              start_date = this.dateRange.start_date;
              end_date = this.dateRange.end_date;
              break;
      }
      const startRequestTime = new Date();
      this.logService.getLogs(start_date, end_date, state_code)
          .subscribe(
              data => {
                  const endRequestTime = new Date();
                  this.responseTime = (endRequestTime.getTime() - startRequestTime.getTime()) / 1000;
                  this.responseTimes.push(this.responseTime);
                  loader.dismiss();
                  this.logsList = data;
                  if(this.logsList.length != 0) this.sortBy('Start Log Date');
                  else this.setPage(1);
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
      this.showToast(field+"", false);
  }

  getCurrentDate(format: string){
      const date = new Date();
      switch (format) {
          case "MM/DD/YYYY":
              return ((date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear());
      }
  }

  conversorDateModelFormat(date: string, format: string, to_format: string){
        let dateSplitArray;
        if(format == "MM/DD/YYYY"){
            dateSplitArray = date.split("/");
            switch (to_format) {
                case "YYYY-MM-DD":
                    if(dateSplitArray[0] < 10 && !dateSplitArray[0].startsWith('0'))
                    return dateSplitArray[2]+"-0"+dateSplitArray[0]+"-"+dateSplitArray[1];
                    else if(dateSplitArray[1] < 10 && !dateSplitArray[0].startsWith('0'))
                    return dateSplitArray[2]+"-"+dateSplitArray[0]+"-0"+dateSplitArray[1];
                    else
                    return dateSplitArray[2]+"-"+dateSplitArray[0]+"-"+dateSplitArray[1];
            }
        }

        if(format == "YYYY-MM-DD"){
            dateSplitArray = date.split("-");
            switch (to_format) {
                case "MM/DD/YYYY":
                    return dateSplitArray[1]+"/"+dateSplitArray[2]+"/"+dateSplitArray[0];
        }
      }
    }
}
