import { IncomingMessage } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { AppController } from './components';

export class WSServer {
  private appController = new AppController();

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
    ws.on('message', (wsData: WebSocket.RawData) => this.handleWsMessage(ws, wsData));
  }

  private handleWsMessage(ws: WebSocket, wsData: WebSocket.RawData) {
    const dataJson: string = wsData.toString();
    console.log('dataJson=', dataJson);

    const responsesArr: string[] = this.getResponseData(dataJson);

    if (!responsesArr.length) return;

    responsesArr.forEach((response: string) => {
      ws.send(response);
    });
  }

  private getResponseData(dataJson: string): string[] {
    return this.appController.getResponseData(dataJson);
  }
}
