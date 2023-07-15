import dbRooms from "../../../db/dbRooms";
import IRoom from "../../../types/IRoom";
import IUserWS from "../../../types/IUserWs";
import checkUserInRoom from "../../../utils/checkUserInRoom";
import updateRoom from "../../../utils/updateRoom";

export default (_message: string, ws: IUserWS) => {
  const roomUser = {
    name: ws.name,
    index: ws.index,
  };
  if (checkUserInRoom(roomUser)) {
    console.error("you created already the room");
    return;
  }
  const room: IRoom = {
    roomId: dbRooms.length,
    roomUsers: [],
  };
  room.roomUsers.push(ws);
  dbRooms.push(room);
  const response = updateRoom();
  return response;
};
