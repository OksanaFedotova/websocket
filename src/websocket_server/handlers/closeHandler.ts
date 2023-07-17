import { WebSocket } from "ws";
import dbRooms from "../../db/dbRooms";
import IUserWS from "../../types/IUserWs";
import updateRoom from "../../utils/updateRoom";

export default (client: IUserWS, clients: Set<WebSocket>) => {
  if (client.hasOwnProperty("name")) {
    dbRooms.forEach((room) => {
      const index = room.roomUsers.findIndex(
        ({ name }) => client.name === name
      );
      room.roomUsers.splice(index, 1);
    });
    updateRoom(clients);
  } else {
    return;
  }
};
