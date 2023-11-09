import { GameField } from '../components/GameField';

export type RoomData = {
  [roomId: number]: RoomUser[];
};

export type RoomUser = {
  name: string;
  index: number;
  gameField: GameField | null;
  isTurn: boolean;
};
