export enum ReqRespTypes {
  Reg = 'reg',
  UpdWinners = 'update_winners',
  CrtRoom = 'create_room',
  AddUserToRoom = 'add_user_to_room',
  CrtGame = 'create_game',
  UpdRoom = 'update_room',
  AddShips = 'add_ships',
  StartGame = 'start_game',
  Attack = 'attack',
  RandomAttack = 'randomAttack',
  Turn = 'turn',
  Finish = 'finish',
  Single = 'single_play',
}

export type ClientReqServerResp = {
  type: ReqRespTypes;
  data: string;
  id: number;
};

export type DataRequest =
  | RegDataReq
  | ''
  | AddUserToRoomDataReq
  | AddShipsDataReq
  | AttackDataReq
  | RandomAttackDataReq;

export type DataResponse =
  | RegDataResp
  | UpdWinnersDataResp[]
  | AddUserToRoomDataResp
  | UpdRoomStateDataResp[]
  | StartDataResp
  | AttackDataResp
  | TurnDataResp
  | FinishDataResp;

export type RegDataReq = {
  name: string;
  password: string;
};

export type RegDataResp = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type UpdWinnersDataResp = {
  name: string;
  wins: number;
};

export type AddUserToRoomDataReq = {
  indexRoom: number;
};

export type AddUserToRoomDataResp = {
  idGame: number;
  idPlayer: number;
};

export type RoomUsers = {
  name: string;
  index: number;
};

export type UpdRoomStateDataResp = {
  roomId: number;
  roomUsers: RoomUsers[];
};

export type ShipPosition = {
  x: number;
  y: number;
};

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type Ship = {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: ShipType;
};

export type AddShipsDataReq = {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
};

export type StartDataResp = {
  ships: Ship[];
  currentPlayerIndex: number;
};

export type AttackDataReq = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
};

export enum AttackStatus {
  Miss = 'miss',
  Killed = 'killed',
  Shot = 'shot',
}

export type AttackDataResp = {
  position: ShipPosition;
  currentPlayer: number;
  status: AttackStatus;
};

export type RandomAttackDataReq = {
  gameId: number;
  indexPlayer: number;
};

export type TurnDataResp = {
  currentPlayer: number;
};

export type FinishDataResp = {
  winPlayer: number;
};
