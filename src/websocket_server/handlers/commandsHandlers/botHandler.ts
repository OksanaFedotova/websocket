import dbBot from "../../../db/dbBot";
import { IResponse } from "../../../types/IResponse";
import IUserWS from "../../../types/IUserWs";

export default (wsClient: IUserWS) => {
  const data = {
    idGame: dbBot.length,
    idPlayer: wsClient.index,
  };
  const response: IResponse = {
    type: "create_game",
    data: JSON.stringify(data),
    id: 0,
  };
  wsClient.send(JSON.stringify(response));
  const game = {
    idGame: dbBot.length,
    user: wsClient,
    startGame: 0,
    currentPlayer: wsClient,
    turn: 0,
  };
  dbBot.push(game);
};
