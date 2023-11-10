import { AttackStatus, Cell, Field, Ship } from '../models';

export class GameField {
  private shipsMatrix: Field = [];
  private ships: Ship[] = [];

  constructor(ships: Ship[]) {
    this.ships = ships;
    this.createShipsMatrix();
  }

  private createShipsMatrix(): void {
    this.createEmptyShipsMatrix();

    this.ships.forEach((ship: Ship) => {
      this.setShipToMatrix(ship);
    });
  }

  private createEmptyShipsMatrix(): void {
    for (let index = 0; index < 10; index++) {
      this.shipsMatrix.push([]);
    }

    this.shipsMatrix.map((matrixRow) => {
      for (let index = 0; index < 10; index++) {
        const cell: Cell = { isShipPart: false, isShot: false, otherShipParts: [] };
        matrixRow.push(cell);
      }
    });
  }

  private setShipToMatrix(ship: Ship): void {
    const {
      position: { x, y },
      direction,
      length,
    } = ship;
    const shipPartsArr: Cell[] = [];

    const firstShipPart: Cell = this.shipsMatrix[y][x];
    firstShipPart.isShipPart = true;
    shipPartsArr.push(firstShipPart);

    for (let index = 1; index < length; index++) {
      const otherShipPart: Cell = direction
        ? this.shipsMatrix[y + index][x]
        : this.shipsMatrix[y][x + index];

      otherShipPart.isShipPart = true;

      shipPartsArr.push(otherShipPart);
    }

    shipPartsArr.forEach((shipPart: Cell, i: number) => {
      shipPartsArr.forEach((otherShipPart: Cell, idx: number) => {
        if (i === idx) return;
        shipPart.otherShipParts.push(otherShipPart);
      });
    });
  }

  public getShipsMatrix(): Field {
    return this.shipsMatrix;
  }

  public getShips(): Ship[] {
    return this.ships;
  }

  public attackCell(x: number, y: number): AttackStatus {
    const cell: Cell = this.shipsMatrix[y][x];

    cell.isShot = true;

    if (!cell.isShipPart) {
      return AttackStatus.Miss;
    }

    const isShipKilled: boolean = cell.otherShipParts.every((shipPart) => shipPart.isShot);
    if (isShipKilled) {
      return AttackStatus.Killed;
    }
    return AttackStatus.Shot;
  }
}
