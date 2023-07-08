import dbRooms from '../../db/dbRooms';
import {IResponse} from '../../types/IResponse';
import IRoom from '../../types/IRoom';
import IUserWS from '../../types/IUserWs';


export default (_message: string, ws: IUserWS) => {
  const roomUser = {
    name: ws.name,
    index: ws.index,
  }
  const userCreatedRoom = dbRooms.some(({roomUsers}) => roomUsers.some(({name, index}) => roomUser.name === name && roomUser.index === index));
  if (userCreatedRoom) {
    console.error('you created room');
    return null;
  }
  const room: IRoom = {
    roomId: dbRooms.length,
    roomUsers: [],
  }
  room.roomUsers.push(roomUser);
  dbRooms.push(room);
  const response: IResponse = {
    type: "update_room",
    data: JSON.stringify(dbRooms),
    id: 0,
  }

  return response;
}