import { RoomUser } from '../components/RoomUser';

export type RoomData = {
  [roomId: number]: RoomUser[];
};
