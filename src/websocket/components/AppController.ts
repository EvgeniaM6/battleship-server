import {
  AddShipsDataReq,
  AddUserToRoomDataReq,
  AddUserToRoomDataResp,
  ClientReqServerResp,
  DataRequest,
  DataResponse,
  PlayersDB,
  RegDataReq,
  RegDataResp,
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
    const dataResp: RegDataResp = this.usersManager.userRegistration(dataReqObj, clientId);
    const resp: WssResponse = this.getResponse(dataResp, ReqRespTypes.Reg, false, [clientId]);

    const roomsResp: WssResponse = this.getAllSingleRoomsResp();
    const winnersResp: WssResponse = this.getAllWinnersResp();
    return [resp, roomsResp, winnersResp];
  }

  private createRoom(clientId: number): WssResponse[] {
    const newRoomId: number | undefined = this.createNewRoom(clientId);
    if (newRoomId === undefined) return [];

    const usersInRoomArr: RoomUser[] = this.addPlayerToRoomById(newRoomId, clientId);
    if (!usersInRoomArr.length) return [];

    const roomsResp: WssResponse = this.getAllSingleRoomsResp();
    return [roomsResp];
  }

  private addUserToRoom(dataReqObj: AddUserToRoomDataReq, clientId: number): WssResponse[] {
    const { indexRoom } = dataReqObj;

    const usersInRoomArr: RoomUser[] = this.addPlayerToRoomById(indexRoom, clientId);
    if (usersInRoomArr.length === 1) return [];

    const respArr: WssResponse[] = usersInRoomArr.map((user: RoomUser, i: number) => {
      const dataRespObj: AddUserToRoomDataResp = {
        idGame: indexRoom,
        idPlayer: i,
      };

      return this.getResponse(dataRespObj, ReqRespTypes.CrtGame, false, [user.index]);
    });

    const updRoomResp: WssResponse = this.getAllSingleRoomsResp();
    respArr.push(updRoomResp);

    return respArr;
  }

  private addPlayerToRoomById(roomId: number, clientId: number): RoomUser[] {
    const player: PlayersDB | null = this.getPlayerById(clientId);
    if (!player) return [];

    return this.game.addUserToRoom(roomId, player);
  }

  private getPlayerById(playerId: number): PlayersDB | null {
    return this.usersManager.getPlayerById(playerId);
  }

  private getAllSingleRoomsResp(): WssResponse {
    const singleRoomsArr: UpdRoomStateDataResp[] = this.game.getAllSingleRooms();
    return this.getResponse(singleRoomsArr, ReqRespTypes.UpdRoom, true, []);
  }

  private getAllWinnersResp(): WssResponse {
    const winnersArr: UpdWinnersDataResp[] = this.game.getWinners();
    return this.getResponse(winnersArr, ReqRespTypes.UpdWinners, true, []);
  }

  private getResponse(
    respData: DataResponse,
    type: ReqRespTypes,
    isRespForAll: boolean,
    usersIdsForRespArr: number[]
  ): WssResponse {
    const respObj: ClientReqServerResp = {
      type,
      data: JSON.stringify(respData),
      id: 0,
    };

    return {
      isRespForAll,
      usersIdsForRespArr,
      responseJson: JSON.stringify(respObj),
    };
  }

  private addShips(dataReqObj: AddShipsDataReq): WssResponse[] {
    const room: RoomUser[] = this.game.addShips(dataReqObj);

    return room.map((player: RoomUser, i: number) => {
      const indexPlayer = i === 0 ? 1 : 0;
      const dataRespObj: StartDataResp = {
        ships: player.gameField?.getShips() || [],
        currentPlayerIndex: indexPlayer,
      };

      return this.getResponse(dataRespObj, ReqRespTypes.StartGame, false, [room[i].index]);
    });
  }

  private createNewRoom(clientId: number): number | undefined {
    return this.game.createNewRoom(clientId);
  }
}
