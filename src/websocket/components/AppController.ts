import {
  AddShipsDataReq,
  AddUserToRoomDataReq,
  AddUserToRoomDataResp,
  ClientReqServerResp,
  DataRequest,
  PlayersDB,
  RegDataReq,
  ReqRespTypes,
  RoomUser,
  StartDataResp,
  UpdRoomStateDataResp,
  UpdWinnersDataResp,
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
        return this.createRoom(wssClientId);
      case ReqRespTypes.AddUserToRoom:
        return this.addUserToRoom(dataObj as AddUserToRoomDataReq, wssClientId);
      case ReqRespTypes.AddShips:
        return this.addShips(dataObj as AddShipsDataReq);
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
      isRespForAll: false,
      usersIdsForRespArr: [clientId],
      responseJson,
    };

    const roomsResp: WssResponse = this.getAllSingleRoomsResp();
    const winnersResp: WssResponse = this.getAllWinnersResp();
    return [resp, roomsResp, winnersResp];
  }

  private createRoom(clientId: number): WssResponse[] {
    const newRoomId: number | undefined = this.game.createNewRoom(clientId);
    if (newRoomId === undefined) return [];

    const player: PlayersDB | null = this.getPlayerById(clientId);
    if (!player) return [];

    this.addPlayerToRoomById(newRoomId, player);

    const roomsResp: WssResponse = this.getAllSingleRoomsResp();
    return [roomsResp];
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
        type: ReqRespTypes.CrtGame,
        data: dataRespJson,
        id: 0,
      };
      const responseJson: string = JSON.stringify(respObj);

      const resp: WssResponse = {
        isRespForAll: false,
        usersIdsForRespArr: [user.index],
        responseJson,
      };
      return resp;
    });

    const updRoomResp: WssResponse = this.getAllSingleRoomsResp();
    respArr.push(updRoomResp);

    return respArr;
  }

  private addPlayerToRoomById(roomId: number, player: PlayersDB): RoomUser[] {
    return this.game.addUserToRoom(roomId, player);
  }

  private getPlayerById(playerId: number): PlayersDB | null {
    return this.usersManager.getPlayerById(playerId);
  }

  private getAllSingleRoomsResp(): WssResponse {
    const singleRoomsArr: UpdRoomStateDataResp[] = this.game.getAllSingleRooms();

    const roomsResp: WssResponse = this.getRespForAll(singleRoomsArr, ReqRespTypes.UpdRoom);
    return roomsResp;
  }

  private getAllWinnersResp(): WssResponse {
    const winnersArr: UpdWinnersDataResp[] = this.game.getWinners();

    const winnersResp: WssResponse = this.getRespForAll(winnersArr, ReqRespTypes.UpdWinners);
    return winnersResp;
  }

  private getRespForAll(respData: unknown, type: ReqRespTypes): WssResponse {
    const dataRespJson: string = JSON.stringify(respData);

    const respObj: ClientReqServerResp = {
      type,
      data: dataRespJson,
      id: 0,
    };

    const responseJson: string = JSON.stringify(respObj);

    const wssResp: WssResponse = {
      isRespForAll: true,
      usersIdsForRespArr: [],
      responseJson,
    };

    return wssResp;
  }

  private addShips(dataReqObj: AddShipsDataReq) {
    const room: RoomUser[] = this.game.addShips(dataReqObj);

    const respArr: WssResponse[] = room.map((player: RoomUser, i: number) => {
      const indexPlayer = i === 0 ? 1 : 0;
      const dataRespObj: StartDataResp = {
        ships: player.gameField?.getShips() || [],
        currentPlayerIndex: indexPlayer,
      };

      const dataRespJson: string = JSON.stringify(dataRespObj);
      const respObj: ClientReqServerResp = {
        type: ReqRespTypes.StartGame,
        data: dataRespJson,
        id: 0,
      };

      const responseJson: string = JSON.stringify(respObj);
      const resp = {
        isRespForAll: false,
        usersIdsForRespArr: [room[i].index],
        responseJson: responseJson,
      };

      return resp;
    });

    return respArr;
  }
}
