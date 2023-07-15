import dbRooms from "../db/dbRooms";
import { IResponse } from "../types/IResponse";

export default () => {
  const rooms = dbRooms.filter((room) => room.roomUsers.length === 1);
  const data = rooms.map((room) => {
    const roomUsers = room.roomUsers.map(({ name, index }) => ({
      name,
      index,
    }));
    return { roomId: room.roomId, roomUsers };
  });
  const response: IResponse = {
    type: "update_room",
    data: JSON.stringify(data),
    id: 0,
  };
  return response;
};
