import { SHIPS_AMOUNT } from '../constants';
import { CreatedShip, Ship, ShipData, ShipPosition } from '../models';
import { createEmptyMatrix } from './createEmptyMatrix';
import { getAroundShipCells } from './getAroundShipCells';

export const getRandomShips = (): Ship[] => {
  const ships: Ship[] = [];
  const shipsMatrix: boolean[][] = createEmptyMatrix(true);

  const shipsArr: CreatedShip[] = [];

  Object.entries(SHIPS_AMOUNT)
    .sort((a: [string, ShipData], b: [string, ShipData]) => {
      return Number(b[0]) - Number(a[0]);
    })
    .map(([shipSize, shipData]: [string, ShipData]) => {
      for (let i = 0; i < shipData.amount; i++) {
        const ship: CreatedShip = {
          type: shipData.type,
          length: Number(shipSize),
          direction: !Math.round(Math.random()),
        };
        shipsArr.push(ship);
      }
    });

  shipsArr.forEach((createdShip: CreatedShip) => {
    const { direction, length } = createdShip;

    const positionsArr: ShipPosition[] = getRandomPosition(direction, length, shipsMatrix);

    const ship: Ship = { ...createdShip, position: positionsArr[0] };
    ships.push(ship);

    const aroundShipPositionArr: ShipPosition[] = getAroundShipCells(ship);

    [...positionsArr, ...aroundShipPositionArr].forEach(({ x, y }: ShipPosition) => {
      if (!shipsMatrix[y]) return;
      if (!shipsMatrix[y][x]) return;
      shipsMatrix[y][x] = false;
    });
  });

  return ships;
};

const getRandomPosition = (
  direction: boolean,
  length: number,
  shipsMatrix: boolean[][]
): ShipPosition[] => {
  let x, y: number;

  let shipPositionsArr: ShipPosition[] = [];
  let isAvailable = false;

  do {
    x = Math.floor(Math.random() * (direction ? 10 : 10 - length + 1));
    y = Math.floor(Math.random() * (direction ? 10 - length + 1 : 10));

    shipPositionsArr = [];
    for (let i = 0; i < length; i++) {
      if (direction) {
        shipPositionsArr.push({ x, y: y + i });
      } else {
        shipPositionsArr.push({ x: x + i, y });
      }
    }

    isAvailable = shipPositionsArr.every((position: ShipPosition) => {
      return shipsMatrix[position.y][position.x];
    });
  } while (!isAvailable);

  return shipPositionsArr;
};
