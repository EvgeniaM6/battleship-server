import { PlayersDB, RoomData, RoomUser, UpdRoomStateDataResp, UpdWinnersDataResp } from '../models';

export class Game {
  private rooms: RoomData = {};
  private winners: UpdWinnersDataResp[] = [];
  private currentRoomId: number = 0;

  public createNewRoom(): number {
    const newRoomId = this.currentRoomId;
    this.rooms[newRoomId] = [];

    this.currentRoomId++;
    return newRoomId;
  }

  public addUserToRoom(roomId: number, player: PlayersDB): RoomUser[] {
    const {
      userData: { name },
      userId,
    } = player;

    const roomUser: RoomUser = {
      name,
      index: userId,
    };

    this.rooms[roomId].push(roomUser);

    return this.rooms[roomId];
  }

  public getAllSingleRooms(): UpdRoomStateDataResp[] {
    const rooms: UpdRoomStateDataResp[] = Object.entries(this.rooms).map(([roomId, roomUsers]) => {
      return { roomId: Number(roomId), roomUsers };
    });

    return rooms.filter((room: UpdRoomStateDataResp) => {
      return room.roomUsers.length === 1;
    });
  }

  public getWinners(): UpdWinnersDataResp[] {
    return this.winners;
  }
}
