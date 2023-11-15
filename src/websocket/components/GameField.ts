import { AttackResult, AttackStatus, Cell, Field, Row, Ship, ShipPosition } from '../models';
import { createEmptyMatrix, getAroundShipCells } from '../utils';

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
    const cell: Cell = {
      isShipPart: false,
      isShot: false,
      otherShipParts: [],
      aroundShipCellsArr: [],
      position: { x: 0, y: 0 },
    };

    const shipsMatrix: Field = createEmptyMatrix(cell);
    this.shipsMatrix = shipsMatrix.map((row: Row, y: number) => {
      return row.map((cell: Cell, x: number) => {
        return {
          ...cell,
          otherShipParts: [],
          aroundShipCellsArr: [],
          position: { x, y },
        };
      });
    });
  }

  private setShipToMatrix(ship: Ship): void {
    const { position, direction, length } = ship;
    const { x, y } = position;

    const shipPartsArr: Cell[] = [];

    for (let index = 0; index < length; index++) {
      const shipPart: Cell = direction
        ? this.shipsMatrix[y + index][x]
        : this.shipsMatrix[y][x + index];

      shipPart.isShipPart = true;

      shipPartsArr.push(shipPart);
    }

    const aroundShipCellsArr: Cell[] = [];
    const aroundShipPositionArr: ShipPosition[] = getAroundShipCells(ship);
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
          cell.isShot = true;
          return { position: cell.position, status: AttackStatus.Miss };
        });

      return [...killedCells, ...missedCells];
    }

    const attackResult = { position: cell.position, status: AttackStatus.Shot };
    return [attackResult];
  }

  public randomAttack(): AttackResult[] {
    const randomPosition: ShipPosition | null = this.getRandomPosition();
    if (!randomPosition) return [];

    return this.attackCell(randomPosition.x, randomPosition.y);
  }

  public getRandomPosition(): ShipPosition | null {
    const availableCellsArr: Cell[] = this.shipsMatrix.flat().filter((cell: Cell) => !cell.isShot);
    if (!availableCellsArr.length) return null;

    const randomCellIdx: number = Math.floor(Math.random() * availableCellsArr.length);

    return availableCellsArr[randomCellIdx].position;
  }

  public isLost(): boolean {
    const notShotCells: Cell[] = this.shipsMatrix
      .flat()
      .filter((cell: Cell) => cell.isShipPart && !cell.isShot);
    return !notShotCells.length;
  }
}
