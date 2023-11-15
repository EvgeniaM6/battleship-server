import process from 'process';
import { httpServer } from './src/http_server/index';
import { WSServer } from './src/websocket/index';

const HTTP_PORT = 8181;
const WSS_PORT = 3000;

console.log(`Start static http server on the http://localhost:${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);

process.on('SIGINT', () => {
  httpServer.close(() => process.exit());
});

new WSServer(WSS_PORT);
