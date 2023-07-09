import dbRooms from "../db/dbRooms";
import IUser from "../types/IUser";

export default (roomUser: IUser) =>
  dbRooms.some(({ roomUsers }) =>
    roomUsers.some(
      ({ name, index }) => roomUser.name === name && roomUser.index === index
    )
  );
