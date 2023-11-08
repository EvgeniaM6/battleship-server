export type RoomData = {
  [roomId: number]: RoomUser[];
};

export type RoomUser = {
  name: string;
  index: number;
};
