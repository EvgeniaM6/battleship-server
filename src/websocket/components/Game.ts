import { PlayersDB, RoomData, RoomUser } from '../models';

export class Game {
  private rooms: RoomData = {};
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
}
