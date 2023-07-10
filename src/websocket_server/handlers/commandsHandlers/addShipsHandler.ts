import dbGames from "../../../db/dbGames";
import dbRooms from "../../../db/dbRooms";
import { IResponse } from "../../../types/IResponse";
import IUserWS from "../../../types/IUserWs";
import turnHandler from "./turnHandler";

export default (message: string, ws: IUserWS) => {
  const { gameId, ships, indexPlayer } = JSON.parse(message);
  const currentGame = dbGames.find(({ idGame }) => idGame === gameId);
  if (currentGame) {
    currentGame.startGame++;
    currentGame.clients?.forEach((user) => {
      if (user.index === indexPlayer) {
        user.ships = ships;
      }
    });
  }
  if (currentGame?.startGame === 2) {
    currentGame.clients?.forEach((user, i, arr) => {
      const data = {
        ships: arr[+!i].ships,
        currentPlayerIndex: currentGame.clients[0].index,
      };
      const response = {
        type: "start_game",
        data: JSON.stringify(data),
        id: 0,
      };
      user.send(JSON.stringify(response));
    });
    turnHandler(currentGame.clients, currentGame.clients[0].index);
  }
};
