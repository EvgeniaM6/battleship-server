export type Cell = {
  isShipPart: boolean;
  isShot: boolean;
  otherShipParts: Cell[];
};

export type Row = Cell[];
export type Field = Row[];
