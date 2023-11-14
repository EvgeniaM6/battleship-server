import { IncomingMessage } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { AppController } from './components';
import { WssClients, WssData, WssResponse } from './models';

export class WSServer {
  private appController = new AppController();
  private wssClients: WssClients = {};
  private currentWssClientId: number = 0;

  constructor(port: number) {
    this.createWsServer(port);
  }

  private createWsServer(port: number) {
    const wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage> = new WebSocketServer({
      port,
    });

    wss.on('connection', (ws: WebSocket) => this.handleWsConnection(ws));
  }

  private handleWsConnection(ws: WebSocket) {
    console.log('connection!');
    const newWssClientId: number = this.saveWssClient(ws);

    ws.on('message', (wsData: WebSocket.RawData) => this.handleWsMessage(newWssClientId, wsData));
  }

  private saveWssClient(ws: WebSocket): number {
    const newWssClientId: number = this.currentWssClientId;
    const newWssData: WssData = {
      isRegistered: false,
      ws,
    };
    this.wssClients[newWssClientId] = newWssData;

    this.currentWssClientId++;
    return newWssClientId;
  }

  private handleWsMessage(wssClientId: number, wsData: WebSocket.RawData) {
    const dataJson: string = wsData.toString();
    console.log('dataJson=', dataJson);

    const responsesArr: WssResponse[] = this.getResponseData(dataJson, wssClientId);

    if (!responsesArr.length) return;

    responsesArr.forEach((response: WssResponse) => {
      const { isRespForAll, usersIdsForRespArr, responseJson } = response;

      if (isRespForAll) {
        Object.values(this.wssClients).forEach((wsData: WssData) => {
          if (!wsData.isRegistered) return;

          wsData.ws.send(responseJson);
        });
      } else {
        usersIdsForRespArr.forEach((userIdForResp: number) => {
          if (!(userIdForResp + 1)) return;

          this.wssClients[userIdForResp].isRegistered = true;

          const ws: WebSocket = this.wssClients[userIdForResp].ws;
          ws.send(responseJson);
        });
      }
    });
  }

  private getResponseData(dataJson: string, wssClientId: number): WssResponse[] {
    return this.appController.getResponseData(dataJson, wssClientId);
  }
}
