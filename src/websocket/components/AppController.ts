import {
  AddShipsDataReq,
  AddUserToRoomDataReq,
  AddUserToRoomDataResp,
  AttackDataReq,
  AttackDataResp,
  ClientReqServerResp,
  DataRequest,
  DataResponse,
  FinishDataResp,
  PlayersDB,
  RandomAttackDataReq,
  RegDataReq,
  RegDataResp,
  ReqRespTypes,
  StartDataResp,
  TurnDataResp,
  UpdRoomStateDataResp,
  UpdWinnersDataResp,
  WssResponse,
} from '../models';
import { Game } from './Game';
import { Room } from './Room';
import { RoomUser } from './RoomUser';
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
      case ReqRespTypes.Attack:
        return this.attack(dataObj as AttackDataReq);
      case ReqRespTypes.RandomAttack:
        return this.randomAttack(dataObj as AttackDataReq);
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
    const room: Room = this.game.addShips(dataReqObj);
    if (!room.haveAllUsersShips()) return [];

    const roomUsersArr = room.getRoomUsers();

    const wssResponseArr: WssResponse[] = roomUsersArr.map((player: RoomUser, i: number) => {
      const indexPlayer = room.getCurrentPlayer();
      const dataRespObj: StartDataResp = {
        ships: player.getShipsArr(),
        currentPlayerIndex: indexPlayer,
      };

      return this.getResponse(dataRespObj, ReqRespTypes.StartGame, false, [roomUsersArr[i].index]);
    });

    wssResponseArr.push(...this.turnResp(dataReqObj.gameId));
    return wssResponseArr;
  }

  private createNewRoom(clientId: number): number | undefined {
    return this.game.createNewRoom(clientId);
  }

  private turnResp(gameId: number): WssResponse[] {
    const usersIdArr: number[] = this.game.getUserIdArrByGameId(gameId);
    const wssResp: WssResponse = this.getTurnResp(gameId, usersIdArr);
    return [wssResp];
  }

  private getTurnResp(gameId: number, usersIdArr: number[]): WssResponse {
    const dataResp: TurnDataResp = this.game.getCurrentPlayerByGameId(gameId);
    return this.getResponse(dataResp, ReqRespTypes.Turn, false, usersIdArr);
  }

  private attack(dataReqObj: AttackDataReq): WssResponse[] {
    const dataRespArr: AttackDataResp[] = this.game.attack(dataReqObj);
    if (!dataRespArr.length) return [];

    return this.getAttackResp(dataReqObj.gameId, dataRespArr);
  }

  private getAttackResp(gameId: number, dataRespArr: AttackDataResp[]): WssResponse[] {
    const usersIdArr: number[] = this.game.getUserIdArrByGameId(gameId);

    const wssRespArr: WssResponse[] = dataRespArr.map((dataResp) => {
      return this.getResponse(dataResp, ReqRespTypes.Attack, false, usersIdArr);
    });
    const winnerId: number = this.game.checkWinner(gameId);

    if (winnerId + 1) {
      const finishDataResp: FinishDataResp = {
        winPlayer: winnerId,
      };

      const wssFinishResp: WssResponse = this.getResponse(
        finishDataResp,
        ReqRespTypes.Finish,
        false,
        usersIdArr
      );
      wssRespArr.push(wssFinishResp);

      const wssWinnersResp: WssResponse = this.getAllWinnersResp();
      wssRespArr.push(wssWinnersResp);
    } else {
      const wssTurnResp: WssResponse = this.getTurnResp(gameId, usersIdArr);
      wssRespArr.push(wssTurnResp);
    }

    return wssRespArr;
  }

  private randomAttack(dataReqObj: RandomAttackDataReq): WssResponse[] {
    const dataRespArr: AttackDataResp[] = this.game.randomAttack(dataReqObj);
    if (!dataRespArr.length) return [];

    return this.getAttackResp(dataReqObj.gameId, dataRespArr);
  }
}
