import { PlayersDB, RegDataReq, RegDataResp } from '../models';

export class DataBase {
  private playersArr: PlayersDB[] = [];
  private currentUserId: number = 0;

  public addPlayer(playerData: RegDataReq) {
    const newUserId = this.currentUserId;

    const newUserData: PlayersDB = {
      userId: newUserId,
      userData: playerData,
    };

    this.currentUserId++;

    this.playersArr.push(newUserData);

    const respData: RegDataResp = {
      name: playerData.name,
      index: newUserId,
      error: false,
      errorText: '',
    };

    return respData;
  }
}
