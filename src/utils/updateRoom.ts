import dbRooms from "../db/dbRooms";
import { IResponse } from "../types/IResponse";

export default () => {
  const data = dbRooms.filter((room) => room.roomUsers.length === 1);
  const response: IResponse = {
    type: "update_room",
    data: JSON.stringify(data),
    id: 0,
  };
  return response;
};
