import WebSocket from 'ws';

export type WssClients = {
  [wssClientId: number]: WebSocket;
};

export type WssResponse = {
  usersIdsForRespArr: number[];
  responseJson: string;
};
