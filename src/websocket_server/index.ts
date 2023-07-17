import 'dotenv/config';
import { WebSocketServer, Server } from 'ws';
import { handler } from './handlers/handler';
import closeHandler from './handlers/closeHandler';
import IUserWS from '../types/IUserWs';

export const webSocketServer = () => {
  const PORT = process.env.port || 3000;
  const wsServer: Server = new WebSocketServer({ port: +PORT });
  console.log(`Start WebSocket server on the ${PORT} port!`);
  wsServer.on('connection', (ws) => {
    ws.on('error', console.error);
    ws.on('message', (data) => {
      try {
        handler(ws, data.toString(), wsServer.clients);
      } catch (e) {
        console.error(e);
      }
    });
    ws.on('close', () => closeHandler(ws as IUserWS, wsServer.clients));
  });
  wsServer.on('close', () => {
    console.log('WebSocket server closed');
  });
};
