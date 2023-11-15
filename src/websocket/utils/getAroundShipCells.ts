import { Ship, ShipPosition } from '../models';

export const getAroundShipCells = (ship: Ship): ShipPosition[] => {
  const { position, direction, length } = ship;
  const { x, y } = position;

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
    aroundShipPositionArr.push({ x: x - 1, y });
    aroundShipPositionArr.push({ x: x + length, y });
  }

  return aroundShipPositionArr;
};
