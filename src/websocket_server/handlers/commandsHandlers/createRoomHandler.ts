import WebSocket from 'ws';
import dbRooms from '../../../db/dbRooms';
import { IResponse } from '../../../types/IResponse';
import IRoom from '../../../types/IRoom';
import IUserWS from '../../../types/IUserWs';
import checkUserInRoom from '../../../utils/checkUserInRoom';
import updateRoom from '../../../utils/updateRoom';
import winnersHandler from './winnersHandler';

export default (_message: string, ws: IUserWS, clients: Set<WebSocket>): IResponse | undefined => {
  const roomUser = {
    name: ws.name,
    index: ws.index,
  };
  if (checkUserInRoom(roomUser)) {
    console.error('you created already the room');
    return;
  }
  const room: IRoom = {
    roomId: dbRooms.length,
    roomUsers: [],
  };
  ws.attacks = [];
  room.roomUsers.push(ws);
  dbRooms.push(room);
  updateRoom(clients);
  winnersHandler(ws.name, clients, false);
};
