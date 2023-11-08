import { PlayersDB, RegDataReq, RegDataResp } from '../models';

export class DataBase {
  private playersArr: PlayersDB[] = [];

  public getPlayerById(playerId: number): PlayersDB | null {
    return this.playersArr.find((player: PlayersDB) => player.userId === playerId) || null;
  }

  public addPlayer(playerData: RegDataReq, newUserId: number) {
    const newUserData: PlayersDB = {
      userId: newUserId,
      userData: playerData,
    };

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
