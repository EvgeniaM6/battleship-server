import { DataBase } from '../database/DataBase';
import { PlayersDB, RegDataReq, RegDataResp } from '../models';

export class UsersManager {
  private db = new DataBase();

  public userRegistration(data: RegDataReq, clientId: number): string {
    const dataObj: RegDataResp = this.db.addPlayer(data, clientId);
    const dataJson: string = JSON.stringify(dataObj);

    return dataJson;
  }

  public getPlayerById(playerId: number): PlayersDB | null {
    return this.db.getPlayerById(playerId);
  }
}
