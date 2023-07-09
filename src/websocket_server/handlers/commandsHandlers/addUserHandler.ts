import dbGames from "../../../db/dbGames";
import dbRooms from "../../../db/dbRooms";
import { IResponse } from "../../../types/IResponse";
import IUserWS from "../../../types/IUserWs";

export default (message: string, ws: IUserWS) => {
  const { indexRoom } = JSON.parse(message);
  const { name, index } = ws;
  const currentRoomUsers = dbRooms.find(
    ({ roomId }) => roomId === indexRoom
  )?.roomUsers;
  if (
    currentRoomUsers?.some((user) => user.index === index && user.name === name)
  ) {
    console.log("you are already in this room");
    return;
  } else {
    currentRoomUsers?.push(ws);
    currentRoomUsers?.forEach((user) => {
      const data = {
        idGame: dbGames.length,
        idPlayer: user.index,
      };
      const response: IResponse = {
        type: "create_game",
        data: JSON.stringify(data),
        id: 0,
      };
      user.send(JSON.stringify(response));
    });
    const game = {
      idGame: dbGames.length,
      clients: currentRoomUsers || [],
      startGame: 0,
      currentPlayer: 0,
    };
    dbGames.push(game);
  }
};
