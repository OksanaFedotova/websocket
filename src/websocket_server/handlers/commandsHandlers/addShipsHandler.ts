import dbGames from "../../../db/dbGames";
import dbRooms from "../../../db/dbRooms";
import { IResponse } from "../../../types/IResponse";
import IUserWS from "../../../types/IUserWs";

export default (message: string, ws: IUserWS) => {
  const { gameId, ships, indexPlayer } = JSON.parse(message);
  const currentGame = dbGames.find(({ idGame }) => idGame === gameId);
  if (currentGame) currentGame.startGame++;
  if (currentGame?.startGame === 2) {
    currentGame.clients?.forEach((user) => {
      if (user.index === indexPlayer) {
        user.ships = ships;
      }
        const data = {
            ships: ships,
            currentPlayerIndex: currentGame.clients[0].index,
          };
        const response = {
          type: "start_game",
          data: JSON.stringify(data),
          id: 0,
        };
        user.send(JSON.stringify(response));
    });
  }
};
