import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import 'rxjs/Rx';
import {LogModel} from "../models/log.model";

@Injectable()
export class LogService{

    private url = 'https://api.cebroker.com/v1/cerenewaltransactions/GetLogsRecordData';

    constructor(private http: HttpClient){}

    getLogs(startdate: string = "", enddate: string = "", state: string = ""){
        const body = '?startdate='+startdate+'&enddate='+enddate+'&state='+state;
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.get<LogModel[]>(this.url+body, {headers: headers});
    }
}