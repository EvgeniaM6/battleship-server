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
}

export type ClientReqServerResp = {
  type: ReqRespTypes;
  data:
    | RegDataReq
    | RegDataResp
    | UpdWinnersDataResp[]
    | ''
    | AddUserToRoomDataReq
    | AddUserToRoomDataResp
    | UpdRoomStateDataResp[]
    | AddShipsDataReq
    | StartDataResp
    | AttackDataReq
    | AttackDataResp
    | RandomAttackDataReq
    | TurnDataResp
    | FinishDataResp;
  id: number;
};

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

type RoomUsers = {
  name: string;
  index: number;
};

export type UpdRoomStateDataResp = {
  roomId: number;
  roomUsers: RoomUsers[];
};

type ShipPosition = {
  x: number;
  y: number;
};

type Ship = {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
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

export type AttackDataResp = {
  position: ShipPosition;
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
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
