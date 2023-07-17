import dbBot from "../../../db/dbBot";
import dbGames from "../../../db/dbGames";
import IUserWS from "../../../types/IUserWs";
import addShips from "./bot/addShipsBot";
import turnHandler from "./turnHandler";

const response = {
  type: "start_game",
  data: "",
  id: 0,
};
export default (message: string, ws: IUserWS) => {
  const { gameId, ships: shipsData, indexPlayer } = JSON.parse(message);
  const currentGame = dbGames.find(({ idGame }) => idGame === gameId);
  const gameBot = dbBot.find(({ idGame }) => idGame === gameId);
  let gameType;
  if (currentGame && currentGame.gameType === "multiplayer") {
    gameType = "multiplayer";
  } else if (gameBot && gameBot.gameType === "bot") {
    gameType = "bot";
  }
  switch (gameType) {
    case "multiplayer":
      if (currentGame) {
        currentGame.startGame++;
        currentGame.clients?.forEach((user) => {
          if (user.index === indexPlayer) {
            user.ships = shipsData;
          }
        });
      }
      if (currentGame?.startGame === 2) {
        currentGame.clients?.forEach((user, i, arr) => {
          const data = {
            ships: arr[+!i].ships,
            currentPlayerIndex: currentGame.clients[0].index,
          };
          response.data = JSON.stringify(data);
          user.send(JSON.stringify(response));
        });
        turnHandler(currentGame, false);
      }
      break;
    case "bot":
      addShips(gameId);
      const ships = dbBot[gameId].bot.map((ship) => {
        const temp = JSON.parse(JSON.stringify(ship));
        delete temp.coordinates;
        return temp;
      });
      const data = {
        ships,
        currentPlayerIndex: ws.index,
      };
      response.data = JSON.stringify(data);
      ws.send(JSON.stringify(response));
      turnHandler(gameBot!, true);
    default:
      break;
  }
};
