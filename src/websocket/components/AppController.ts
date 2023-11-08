import {
  AddUserToRoomDataReq,
  AddUserToRoomDataResp,
  ClientReqServerResp,
  DataRequest,
  PlayersDB,
  RegDataReq,
  ReqRespTypes,
  RoomUser,
  WssResponse,
} from '../models';
import { Game } from './Game';
import { UsersManager } from './UsersManager';

export class AppController {
  private usersManager = new UsersManager();
  private game = new Game();

  public getResponseData(dataJson: string, wssClientId: number): WssResponse[] {
    const dataReqObj: ClientReqServerResp = JSON.parse(dataJson);

    const { type, data } = dataReqObj;

    const dataObj: DataRequest = data === '' ? data : JSON.parse(data);

    switch (type) {
      case ReqRespTypes.Reg:
        return this.userRegistration(dataObj as RegDataReq, wssClientId);
      case ReqRespTypes.CrtRoom:
        this.createRoom(wssClientId);
        return [];
      case ReqRespTypes.AddUserToRoom:
        return this.addUserToRoom(dataObj as AddUserToRoomDataReq, wssClientId);
      default:
        return [];
    }
  }

  private userRegistration(dataReqObj: RegDataReq, clientId: number): WssResponse[] {
    const dataRespJson: string = this.usersManager.userRegistration(dataReqObj, clientId);

    const respObj: ClientReqServerResp = {
      type: ReqRespTypes.Reg,
      data: dataRespJson,
      id: 0,
    };

    const responseJson: string = JSON.stringify(respObj);

    const resp: WssResponse = {
      usersIdsForRespArr: [clientId],
      responseJson,
    };

    return [resp];
  }

  private createRoom(clientId: number): void {
    const newRoomId: number = this.game.createNewRoom();

    const player: PlayersDB | null = this.getPlayerById(clientId);
    if (!player) return;

    this.addPlayerToRoomById(newRoomId, player);
  }

  private addUserToRoom(dataReqObj: AddUserToRoomDataReq, clientId: number): WssResponse[] {
    const { indexRoom } = dataReqObj;

    const player: PlayersDB | null = this.getPlayerById(clientId);
    if (!player) return [];

    const usersInRoomArr: RoomUser[] = this.addPlayerToRoomById(indexRoom, player);

    if (usersInRoomArr.length === 1) return [];

    const respArr: WssResponse[] = usersInRoomArr.map((user: RoomUser, i: number) => {
      const dataRespObj: AddUserToRoomDataResp = {
        idGame: indexRoom,
        idPlayer: i,
      };

      const dataRespJson: string = JSON.stringify(dataRespObj);
      const respObj: ClientReqServerResp = {
        type: ReqRespTypes.Reg,
        data: dataRespJson,
        id: 0,
      };
      const responseJson: string = JSON.stringify(respObj);

      const resp: WssResponse = {
        usersIdsForRespArr: [user.index],
        responseJson,
      };
      return resp;
    });

    return respArr;
  }

  private addPlayerToRoomById(roomId: number, player: PlayersDB): RoomUser[] {
    return this.game.addUserToRoom(roomId, player);
  }

  private getPlayerById(playerId: number): PlayersDB | null {
    return this.usersManager.getPlayerById(playerId);
  }
}
