import {Component, OnInit} from '@angular/core';
import {IonicPage, ViewController, NavParams, ToastController} from 'ionic-angular';
import {DateRangeModel} from "../../../models/date_range.model";

@IonicPage()
@Component({
  selector: 'page-date-range',
  templateUrl: 'date-range.html',
})
export class DateRangePage implements OnInit{

  private dates: DateRangeModel = new DateRangeModel('', '');

  constructor(private viewCtrl: ViewController, private toastCtrl: ToastController,
              private navParams: NavParams) {}

  ngOnInit(){
    this.dates.start_date = this.navParams.get('start_date');
    this.dates.end_date = this.navParams.get('end_date');
  }

  onClose(){
    this.viewCtrl.dismiss({dates: this.dates, find: false});
  }

  toFind(){
    let date_one = new Date(this.dates.start_date);
    let date_two = new Date(this.dates.end_date);
    if(date_two < date_one){
      this.showToast('End date cannot be greater than start date !');
    } else {
      this.viewCtrl.dismiss({dates: this.dates, find: true});
    }
  }

  showToast(information: string){
    let toast = this.toastCtrl.create({
                message: information,
                showCloseButton: true,
                closeButtonText: "OK",
                position: 'bottom'
            });
    toast.present();
  }
}
