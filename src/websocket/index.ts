import { WebSocketServer } from 'ws';

export class WSServer {
  constructor(port: number) {
    const wss = new WebSocketServer({ port });

    const data = {
      name: 'string',
      index: 0,
      error: false,
      errorText: '',
    };

    const res = {
      type: 'reg',
      data: JSON.stringify(data),
      id: 0,
    };

    const jsonMess = JSON.stringify(res);
    console.log('jsonMess=', jsonMess);

    wss.on('connection', (ws) => {
      console.log('connection!');

      ws.on('message', (data) => {
        console.log('data=', data.toString());

        ws.send(jsonMess);
      });
    });
  }
}
