import { BOT_INDEX } from '../constants';
import { AttackDataResp, AttackResult, AttackStatus, RoomUsers, Ship } from '../models';
import { getRandomShips } from '../utils';
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

  public attack(x: number, y: number, indexPlayer: number): AttackDataResp[] {
    if (indexPlayer !== this.currentPlayer) return [];

    const enemyIdx: number = indexPlayer === 0 ? 1 : 0;
    const attackResult: AttackResult[] = this.roomUsers[enemyIdx].attack(x, y);
    if (!attackResult.length) return [];

    const attackDataResp = this.getAttackDataResp(indexPlayer, attackResult);

    const botAttackDataResp: AttackDataResp[] = this.getBotAttackDataResp(indexPlayer);
    attackDataResp.push(...botAttackDataResp);

    return attackDataResp;
  }

  public getBotAttackDataResp(indexPlayer: number): AttackDataResp[] {
    if (this.roomUsers[1].index !== BOT_INDEX) return [];
    if (indexPlayer === 1) return [];

    const botAttackDataRespArr: AttackDataResp[] = [];

    const botAttackDataResp: AttackDataResp[] = this.randomAttack(1);
    if (!botAttackDataResp.length) return [];
    botAttackDataRespArr.push(...botAttackDataResp);

    if (botAttackDataResp[0].status !== AttackStatus.Miss) {
      const attackDataResp: AttackDataResp[] = this.getBotAttackDataResp(indexPlayer);
      botAttackDataRespArr.push(...attackDataResp);
    }

    return botAttackDataRespArr;
  }

  private getAttackDataResp(indexPlayer: number, attackResult: AttackResult[]): AttackDataResp[] {
    const attackStatus = attackResult[0].status;
    if (attackStatus === AttackStatus.Miss) {
      this.changeCurrentPlayer();
    }

    const attackDataResp: AttackDataResp[] = attackResult.map((attackRes: AttackResult) => {
      const attackResp: AttackDataResp = { ...attackRes, currentPlayer: indexPlayer };
      return attackResp;
    });
    return attackDataResp;
  }

  public randomAttack(indexPlayer: number): AttackDataResp[] {
    if (indexPlayer !== this.currentPlayer) return [];

    const enemyIdx: number = indexPlayer === 0 ? 1 : 0;
    const attackResult: AttackResult[] = this.roomUsers[enemyIdx].randomAttack();
    if (!attackResult.length) return [];

    const attackDataResp = this.getAttackDataResp(indexPlayer, attackResult);

    const botAttackDataResp: AttackDataResp[] = this.getBotAttackDataResp(indexPlayer);
    attackDataResp.push(...botAttackDataResp);

    return attackDataResp;
  }

  public checkWinner(): number {
    const lostUserIdx: number = this.roomUsers.findIndex((user: RoomUser) => {
      return user.isLost();
    });

    if (lostUserIdx + 1) {
      return lostUserIdx === 0 ? 1 : 0;
    }
    return lostUserIdx;
  }

  public getUserById(userId: number): string {
    return this.roomUsers[userId].name;
  }

  public addShipsForBot() {
    const ships: Ship[] = getRandomShips();
    this.addShipsForUser(1, ships);
  }
}
