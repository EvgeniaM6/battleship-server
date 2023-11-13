import { AttackDataResp, ShipPosition } from './reqResp.model';

export type Cell = {
  position: ShipPosition;
  isShipPart: boolean;
  isShot: boolean;
  otherShipParts: Cell[];
};

export type Row = Cell[];
export type Field = Row[];

export type AttackResult = Omit<AttackDataResp, 'currentPlayer'>;
