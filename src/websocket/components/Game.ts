import {
  AddShipsDataReq,
  AttackDataReq,
  AttackDataResp,
  PlayersDB,
  RandomAttackDataReq,
  RoomData,
  RoomUsers,
  TurnDataResp,
  UpdRoomStateDataResp,
  UpdWinnersDataResp,
} from '../models';
import { Room } from './Room';
import { RoomUser } from './RoomUser';

export class Game {
  private rooms: RoomData = {};
  private winners: UpdWinnersDataResp[] = [];
  private currentRoomId: number = 0;

  public createNewRoom(clientId: number): number | undefined {
    const isCreatedRoomWithPlayer: boolean = this.checkIsCreatedRoomWithPlayer(clientId);
    if (isCreatedRoomWithPlayer) return;

    const newRoomId = this.currentRoomId;
    this.rooms[newRoomId] = new Room();

    this.currentRoomId++;
    return newRoomId;
  }

  public addUserToRoom(roomId: number, player: PlayersDB): RoomUser[] {
    const { userId } = player;

    const isSamePlayer: boolean = this.rooms[roomId].hasUserById(userId);
    if (isSamePlayer) return this.rooms[roomId].getRoomUsers();

    const roomUser = new RoomUser(player);
    this.rooms[roomId].addUser(roomUser);

    this.deleteRoom(roomId, userId);

    return this.rooms[roomId].getRoomUsers();
  }

  public getAllSingleRooms(): UpdRoomStateDataResp[] {
    const rooms: UpdRoomStateDataResp[] = Object.entries(this.rooms).map(
      ([roomId, room]: [string, Room]) => {
        const roomUsers: RoomUsers[] = room.getRoomUsersForResp();
        return { roomId: Number(roomId), roomUsers };
      }
    );

    return rooms.filter((room: UpdRoomStateDataResp) => {
      return room.roomUsers.length === 1;
    });
  }

  public getWinners(): UpdWinnersDataResp[] {
    return this.winners;
  }

  private checkIsCreatedRoomWithPlayer(clientId: number): boolean {
    const onlySingleRoomsArr: UpdRoomStateDataResp[] = this.getAllSingleRooms();
    return onlySingleRoomsArr.some((room: UpdRoomStateDataResp) => {
      return room.roomUsers.some((roomUser) => roomUser.index === clientId);
    });
  }

  private deleteRoom(currRoomId: number, playerId: number): void {
    const isRoomCompleted = this.rooms[currRoomId].isRoomCompleted();
    if (!isRoomCompleted) return;

    const roomIdToDelete: string | undefined = Object.keys(this.rooms).find((roomId: string) => {
      return this.rooms[Number(roomId)].hasUserById(playerId);
    });

    if (!roomIdToDelete) return;
    delete this.rooms[Number(roomIdToDelete)];
  }

  public addShips(dataReqObj: AddShipsDataReq): Room {
    const { gameId, ships, indexPlayer } = dataReqObj;

    const room: Room = this.rooms[gameId];
    room.addShipsForUser(indexPlayer, ships);

    return room;
  }

  public getCurrentPlayerByGameId(gameId: number): TurnDataResp {
    return {
      currentPlayer: this.rooms[gameId].getCurrentPlayer(),
    };
  }

  public getUserIdArrByGameId(gameId: number): number[] {
    return this.rooms[gameId].getUserIdArr();
  }

  public attack(dataReqObj: AttackDataReq): AttackDataResp[] {
    const { gameId, x, y, indexPlayer } = dataReqObj;
    return this.rooms[gameId].attack(x, y, indexPlayer);
  }

  public randomAttack(dataReqObj: RandomAttackDataReq): AttackDataResp[] {
    const { gameId, indexPlayer } = dataReqObj;
    return this.rooms[gameId].randomAttack(indexPlayer);
  }

  public checkWinner(gameId: number): number {
    const winnerIdx: number = this.rooms[gameId].checkWinner();

    if (winnerIdx + 1) {
      this.saveWinner(this.rooms[gameId].getUserById(winnerIdx));
    }
    return winnerIdx;
  }

  private saveWinner(name: string): void {
    const winnerIdxInDb: number = this.winners.findIndex(
      (winner: UpdWinnersDataResp) => winner.name === name
    );

    if (winnerIdxInDb + 1) {
      this.winners[winnerIdxInDb].wins++;
      return;
    }

    this.winners.push({ name, wins: 1 });
  }

  public createBot(gameId: number): void {
    this.addUserToRoom(gameId, { userId: -1, userData: { name: '--Bot--', password: '' } });
    this.rooms[gameId].addShipsForBot();
  }
}
