import WebSocket from "ws";
import dbGames from "../../../db/dbGames";
import dbRooms from "../../../db/dbRooms";
import { IResponse } from "../../../types/IResponse";
import IUserWS from "../../../types/IUserWs";
import updateRoom from "../../../utils/updateRoom";
import removeRoom from "../../../utils/removeRoom";

export default (message: string, ws: IUserWS, clients: Set<WebSocket>) => {
  const { indexRoom } = JSON.parse(message);
  const { name, index } = ws;
  ws.attacks = [];
  const currentRoomUsers = dbRooms.find(
    ({ roomId }) => roomId === indexRoom
  )?.roomUsers;
  if (currentRoomUsers) {
    if (
      currentRoomUsers?.some(
        (user) => user.index === index && user.name === name
      )
    ) {
      console.log("you are already in this room");
      return;
    } else {
      currentRoomUsers?.push(ws);
      //remove player from his room and his room from room lists
      removeRoom(ws);
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
      updateRoom(clients);
      const game = {
        idGame: dbGames.length,
        clients: currentRoomUsers || [],
        startGame: 0,
        currentPlayer: currentRoomUsers[0],
        turn: 0,
        gameType: "multiplayer",
      };
      dbGames.push(game);
    }
  }
};
