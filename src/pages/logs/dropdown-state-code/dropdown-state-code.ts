import {Component, OnInit} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dropdown-state-code',
  templateUrl: 'dropdown-state-code.html',
})
export class DropdownStateCodePage implements OnInit{

  private StateCode: string = "";

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {}

  ngOnInit(){
    this.StateCode = this.navParams.get('option');
  }

  changeStateCode(){
    this.viewCtrl.dismiss(this.StateCode);
  }
}
