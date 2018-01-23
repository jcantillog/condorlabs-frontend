import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {LogModel} from "../../models/log.model";
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage implements OnInit{

  private logsList: LogModel[] = [];
  private responseTime: number = 0;
  private responseTimes: number[] = [];

  @ViewChild('timeGraph') timeGraph;
  @ViewChild('machineGraph') machineGraph;
  @ViewChild('csGraph') csGraph;
  private timeLineChart: any;
  private machineBarChart: any;
  private csBarChart: any;

  private timeGraphLabels: string[] = [];
  private timeGraphType: string = "";
  private timeGraphDataSets: any[] = [];

  private machineGraphLabels: string[] = [];
  private machineGraphType: string = "";
  private machineGraphDataSets: any[] = [];

  private csGraphLabels: string[] = [];
  private csGraphType: string = "";
  private csGraphDataSets: any[] = [];

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
  }

  onClose(){
        this.viewCtrl.dismiss();
    }

  ngOnInit(){
    this.logsList = this.navParams.get('logsList');
    this.responseTime = this.navParams.get('responseTime');
    this.responseTimes = this.navParams.get('responseTimes');

    this.timeGraphType = "line";
    this.timeGraphLabels = this.getTimeLabels();
    this.timeGraphDataSets = [{
          data: this.getTimeData(),
          label: 'Average response time per day',
          borderWidth: 1
      }];
    this.updateTimeLineGraph();

    this.machineGraphType = "bar";
    this.machineGraphLabels = this.getMachineLabels();
    this.machineGraphDataSets = [{
        data: this.getMachineData(),
        label: 'Requests per machine',
        borderWidth: 1
    }];
    this.updateMachineBarGraph();

    this.csGraphType = "bar";
    this.csGraphLabels = this.getCSLabels();
    this.csGraphDataSets = [{
          data: this.getCSData(),
          label: 'Requests per compliance status',
          borderWidth: 1
      }];
    this.updateCSBarGraph();
  }

  public chartClicked(e:any):void {
        console.log(e);
  }

  public chartHovered(e:any):void {
        console.log(e);
  }

  getTotalAverageTimeResponse(){
      let value: number = 0;
      for(let time of this.responseTimes){
          value += time;
      }
      return value/this.responseTimes.length;
  }

  getTimeLabels(){
        let labels: string[] = [], iterator = 0;
        for(let response of this.responseTimes){
            iterator++;
            labels.push(iterator+"");
        }

        return labels;
    }

  getTimeData(){
      return this.responseTimes;
  }

  updateTimeLineGraph(){
      this.timeLineChart = new Chart(this.timeGraph.nativeElement, {
          type: this.timeGraphType,
          data: {
              labels: this.timeGraphLabels,
              datasets: this.timeGraphDataSets
          }
      });
  }

  getMachineLabels(){
      let labels: string[] = [], equalMachines = false;
      for(let log of this.logsList){
          if(labels.length == 0){
              labels.push(log.cd_machine);
          }
          for(let label of labels){
              if(log.cd_machine == label) {
                  equalMachines = true;
                  break;
              }
          }
          if(equalMachines == false) labels.push(log.cd_machine);
          equalMachines = false;
      }

      return labels;
  }

  getMachineData(){
    let data: number[] = [], iterator: number = 0;
    for(let label of this.machineGraphLabels){
        for(let log of this.logsList){
            if(label == log.cd_machine){
                iterator++;
            }
        }
        data.push(iterator);
        iterator = 0;
    }

    return data;
  }

  updateMachineBarGraph(){
      this.machineBarChart = new Chart(this.machineGraph.nativeElement, {
            type: this.machineGraphType,
            data: {
                labels: this.machineGraphLabels,
                datasets: this.machineGraphDataSets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }

        });
  }

  getCSLabels(){
        let labels: string[] = [], equalCS = false;
        for(let log of this.logsList){
            if(labels.length == 0){
                labels.push(log.ds_compl_status_returned);
            }
            for(let label of labels){
                if(log.ds_compl_status_returned == label) {
                    equalCS = true;
                    break;
                }
            }
            if(equalCS == false) labels.push(log.ds_compl_status_returned);
            equalCS = false;
        }

        return labels;
  }

  getCSData(){
        let data: number[] = [], iterator: number = 0;
        for(let label of this.csGraphLabels){
            for(let log of this.logsList){
                if(label == log.ds_compl_status_returned){
                    iterator++;
                }
            }
            data.push(iterator);
            iterator = 0;
        }

        return data;
    }

  updateCSBarGraph(){
      this.csBarChart = new Chart(this.csGraph.nativeElement, {
            type: this.csGraphType,
            data: {
                labels: this.csGraphLabels,
                datasets: this.csGraphDataSets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }

        });
  }
}
