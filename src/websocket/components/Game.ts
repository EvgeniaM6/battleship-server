import {
  AddShipsDataReq,
  PlayersDB,
  RoomData,
  RoomUsers,
  UpdRoomStateDataResp,
  UpdWinnersDataResp,
} from '../models';
import { RoomUser } from './RoomUser';

export class Game {
  private rooms: RoomData = {};
  private winners: UpdWinnersDataResp[] = [];
  private currentRoomId: number = 0;

  public createNewRoom(clientId: number): number | undefined {
    const isCreatedRoomWithPlayer: boolean = this.checkIsCreatedRoomWithPlayer(clientId);
    if (isCreatedRoomWithPlayer) return;

    const newRoomId = this.currentRoomId;
    this.rooms[newRoomId] = [];

    this.currentRoomId++;
    return newRoomId;
  }

  public addUserToRoom(roomId: number, player: PlayersDB): RoomUser[] {
    const { userId } = player;

    const isSamePlayer: boolean = this.rooms[roomId][0]?.index === userId;
    if (isSamePlayer) return this.rooms[roomId];

    const roomUser = new RoomUser(player);
    this.rooms[roomId].push(roomUser);

    this.deleteRoom(roomId, userId);

    return this.rooms[roomId];
  }

  public getAllSingleRooms(): UpdRoomStateDataResp[] {
    const rooms: UpdRoomStateDataResp[] = Object.entries(this.rooms).map(
      ([roomId, roomUsersArr]: [string, RoomUser[]]) => {
        const roomUsers: RoomUsers[] = roomUsersArr.map((roomUser: RoomUser) => {
          return { name: roomUser.name, index: roomUser.index };
        });

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
    const playersAmount = this.rooms[currRoomId].length;
    if (playersAmount === 1) return;

    const roomIdToDelete: string | undefined = Object.keys(this.rooms).find((roomId: string) => {
      return this.rooms[Number(roomId)][0].index === playerId;
    });

    if (!roomIdToDelete) return;
    delete this.rooms[Number(roomIdToDelete)];
  }

  public addShips(dataReqObj: AddShipsDataReq) {
    const { gameId, ships, indexPlayer } = dataReqObj;

    const room: RoomUser[] = this.rooms[gameId];
    room[indexPlayer].addShips(ships);

    const didAllPlayersAddShips: boolean = room.every((player) => player.haveShips());

    if (!didAllPlayersAddShips) {
      return [];
    }

    return room;
  }
}
