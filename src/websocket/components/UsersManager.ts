import { DataBase } from '../database/DataBase';
import { PlayersDB, RegDataReq, RegDataResp } from '../models';

export class UsersManager {
  private db = new DataBase();

  public userRegistration(data: RegDataReq, clientId: number): RegDataResp {
    return this.db.addPlayer(data, clientId);
  }

  public getPlayerById(playerId: number): PlayersDB | null {
    return this.db.getPlayerById(playerId);
  }
}
