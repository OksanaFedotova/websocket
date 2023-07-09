import dbGames from '../../../db/dbGames';
import dbRooms from '../../../db/dbRooms';
import {IResponse} from '../../../types/IResponse';
import IUserWS from '../../../types/IUserWs';

export default (message: string, ws: IUserWS) => {
  const { indexRoom } = JSON.parse(message);
  const { name, index } = ws;
  dbRooms.forEach((room) => console.log(room, indexRoom));
  const currentRoom = dbRooms.find(({roomId}) => roomId === indexRoom);
  const currentRoomUsers = dbRooms.find(({roomId}) => roomId === indexRoom)?.roomUsers;
  if (currentRoomUsers?.some((user) => user.index === index && user.name === name)) {
    console.log('you are already in this room');
    return;
  } else {
    currentRoomUsers?.push(ws);
    currentRoomUsers?.forEach((user) => {
      const game = {
        idGame: dbGames.length,
        idPlayer: user.index,
    }
    const response: IResponse = {
      type: "create_game",
      data: JSON.stringify(game),
      id: 0,
    };
    user.send((JSON.stringify(response)))
  })
  }
}