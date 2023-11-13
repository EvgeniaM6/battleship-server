import { AttackResult, AttackStatus, Cell, Field, Row, Ship, ShipPosition } from '../models';

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

    this.shipsMatrix.map((matrixRow: Row, i: number) => {
      for (let index = 0; index < 10; index++) {
        const cell: Cell = {
          isShipPart: false,
          isShot: false,
          otherShipParts: [],
          aroundShipCellsArr: [],
          position: { x: index, y: i },
        };
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

    const aroundShipCellsArr: Cell[] = [];
    const aroundShipPositionArr: ShipPosition[] = this.getAroundShipCells(x, y, direction, length);
    aroundShipPositionArr.forEach(({ x, y }: ShipPosition) => {
      if (!this.shipsMatrix[y]) return;
      if (!this.shipsMatrix[y][x]) return;
      aroundShipCellsArr.push(this.shipsMatrix[y][x]);
    });

    shipPartsArr.forEach((shipPart: Cell, i: number) => {
      shipPartsArr.forEach((otherShipPart: Cell, idx: number) => {
        if (i === idx) return;
        shipPart.otherShipParts.push(otherShipPart);
      });

      shipPart.aroundShipCellsArr = aroundShipCellsArr;
    });
  }

  public getShipsMatrix(): Field {
    return this.shipsMatrix;
  }

  public getShips(): Ship[] {
    return this.ships;
  }

  public attackCell(x: number, y: number): AttackResult[] {
    const cell: Cell = this.shipsMatrix[y][x];
    if (cell.isShot) return [];

    cell.isShot = true;

    if (!cell.isShipPart) {
      const attackResult = { position: cell.position, status: AttackStatus.Miss };
      return [attackResult];
    }

    const isShipKilled: boolean = cell.otherShipParts.every((shipPart) => shipPart.isShot);
    if (isShipKilled) {
      const killedCells: AttackResult[] = [cell, ...cell.otherShipParts].map((cell: Cell) => {
        return { position: cell.position, status: AttackStatus.Killed };
      });
      const missedCells: AttackResult[] = cell.aroundShipCellsArr
        .filter((cell: Cell) => !cell.isShot)
        .map((cell: Cell) => {
          return { position: cell.position, status: AttackStatus.Miss };
        });
      cell.aroundShipCellsArr.forEach((cell: Cell) => (cell.isShot = true));
      return [...killedCells, ...missedCells];
    }

    const attackResult = { position: cell.position, status: AttackStatus.Shot };
    return [attackResult];
  }

  getAroundShipCells(x: number, y: number, direction: boolean, length: number): ShipPosition[] {
    const aroundShipPositionArr: ShipPosition[] = [];

    for (let index = -1; index <= length; index++) {
      if (direction) {
        aroundShipPositionArr.push({ x: x - 1, y: y + index });
        aroundShipPositionArr.push({ x: x + 1, y: y + index });
      } else {
        aroundShipPositionArr.push({ x: x + index, y: y - 1 });
        aroundShipPositionArr.push({ x: x + index, y: y + 1 });
      }
    }

    if (direction) {
      aroundShipPositionArr.push({ x, y: y - 1 });
      aroundShipPositionArr.push({ x, y: y + length });
    } else {
      aroundShipPositionArr.push({ x: x - 1, y: y - 1 });
      aroundShipPositionArr.push({ x: x + length, y });
    }

    return aroundShipPositionArr;
  }
}
