import dbBot from "../../../../db/dbBot";
import dbUsers from "../../../../db/dbUsers";
import { IResponse } from "../../../../types/IResponse";
import IUserWS from "../../../../types/IUserWs";
import { getArray } from "../../../../utils/utils";

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
    currentPlayer: wsClient.index,
    turn: 0,
    gameType: "bot",
    bot: [],
    botIndex: dbUsers.size + 1,
    botMap: getArray(100),
  };
  dbBot.push(game);
};
