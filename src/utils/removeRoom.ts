import dbRooms from '../db/dbRooms';
import IUser from '../types/IUser';

export default (roomUser: IUser) => {
  const rooms = dbRooms.filter((room) => room.roomUsers.length === 1);
  const index = rooms.find(({ roomUsers }) =>
    roomUsers.some(({ name, index }) => roomUser.name === name && roomUser.index === index),
  )?.roomId;
  if (index) dbRooms.splice(index, 1);
};
