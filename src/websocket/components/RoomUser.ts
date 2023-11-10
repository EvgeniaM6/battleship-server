import { AttackStatus, PlayersDB, Ship } from '../models';
import { GameField } from './GameField';

export class RoomUser {
  public name: string;
  public index: number;
  private gameField: GameField | null = null;

  constructor(player: PlayersDB) {
    const {
      userData: { name },
      userId,
    } = player;

    this.name = name;
    this.index = userId;
  }

  public addShips(ships: Ship[]): void {
    this.gameField = new GameField(ships);
  }

  public haveShips(): boolean {
    return this.gameField !== null;
  }

  public getShipsArr(): Ship[] {
    return this.gameField ? this.gameField.getShips() : [];
  }

  public attack(x: number, y: number): AttackStatus {
    if (!this.gameField) {
      return AttackStatus.Miss;
    }

    return this.gameField.attackCell(x, y);
  }
}
