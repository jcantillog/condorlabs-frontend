export class LogModel{
    constructor(public cd_cebroker_state: string,
                public cd_environment: string,
                public cd_machine: string,
                public cd_profession: string,
                public ds_compl_status_returned: string,
                public dt_Start_Log: string,
                public dt_end: string,
                public dt_end_log: string,
                public id_client_nbr: string,
                public id_license: string,
                public pro_cde: number){}
}