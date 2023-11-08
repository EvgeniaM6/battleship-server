import { DataBase } from '../database/DataBase';
import { RegDataReq, RegDataResp } from '../models';

export class UsersManager {
  private db = new DataBase();

  public userRegistration(data: RegDataReq): string {
    const dataObj: RegDataResp = this.db.addPlayer(data);
    const dataJson: string = JSON.stringify(dataObj);

    return dataJson;
  }
}
