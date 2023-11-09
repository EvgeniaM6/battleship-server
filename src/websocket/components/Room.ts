import { RoomUsers, Ship } from '../models';
import { RoomUser } from './RoomUser';

export class Room {
  private currentPlayer: number = 0;
  private roomUsers: RoomUser[] = [];

  public getRoomUsers(): RoomUser[] {
    return this.roomUsers;
  }

  public getRoomUsersForResp(): RoomUsers[] {
    return this.roomUsers.map((roomUser: RoomUser) => {
      return { name: roomUser.name, index: roomUser.index };
    });
  }

  public getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  public changeCurrentPlayer(): void {
    const currentPlayer = this.currentPlayer;
    this.currentPlayer = currentPlayer === 0 ? 1 : 0;
  }

  public hasUserById(userId: number): boolean {
    return this.roomUsers[0]?.index === userId;
  }

  public isRoomCompleted(): boolean {
    return this.roomUsers.length === 2;
  }

  public haveAllUsersShips(): boolean {
    return this.roomUsers.every((roomUser: RoomUser) => {
      return roomUser.haveShips();
    });
  }

  public addUser(roomUser: RoomUser): void {
    this.roomUsers.push(roomUser);
  }

  public addShipsForUser(indexPlayer: number, shipsArr: Ship[]): void {
    this.roomUsers[indexPlayer].addShips(shipsArr);
  }

  public didAllPlayersAddShips(): boolean {
    return this.roomUsers.every((player) => player.haveShips());
  }

  public getUserIdArr(): number[] {
    return this.roomUsers.map((roomUser) => roomUser.index);
  }
}
