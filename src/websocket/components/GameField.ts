import { Cell, Field, Ship } from '../models';

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
    const firstShipPart = this.shipsMatrix[y][x];
    firstShipPart.isShipPart = true;

    for (let index = 1; index < length; index++) {
      const otherShipPart = direction
        ? this.shipsMatrix[y + index][x]
        : this.shipsMatrix[y][x + index];

      otherShipPart.isShipPart = true;

      firstShipPart.otherShipParts.push(otherShipPart);
      otherShipPart.otherShipParts.push(firstShipPart);
    }
  }

  public getShipsMatrix(): Field {
    return this.shipsMatrix;
  }

  public getShips(): Ship[] {
    return this.ships;
  }
}
