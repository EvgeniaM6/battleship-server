import { AttackDataResp, Ship, ShipPosition, ShipType } from './reqResp.model';

export type Cell = {
  position: ShipPosition;
  isShipPart: boolean;
  isShot: boolean;
  otherShipParts: Cell[];
  aroundShipCellsArr: Cell[];
};

export type Row = Cell[];
export type Field = Row[];

export type AttackResult = Omit<AttackDataResp, 'currentPlayer'>;

export type ShipsInfo = {
  [key: number]: ShipData;
};

export type ShipData = {
  type: ShipType;
  amount: number;
};

export type CreatedShip = Omit<Ship, 'position'>;
