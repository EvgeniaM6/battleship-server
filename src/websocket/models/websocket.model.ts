import WebSocket from 'ws';

export type WssClients = {
  [wssClientId: number]: WssData;
};

export type WssData = {
  isRegistered: boolean;
  ws: WebSocket;
};

export type WssResponse = {
  isRespForAll: boolean;
  usersIdsForRespArr: number[];
  responseJson: string;
};
