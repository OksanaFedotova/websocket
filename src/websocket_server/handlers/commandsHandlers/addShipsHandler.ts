import dbBot from "../../../db/dbBot";
import dbGames from "../../../db/dbGames";
import IUserWS from "../../../types/IUserWs";
import turnHandler from "./turnHandler";

export default (message: string, ws: IUserWS) => {
  const { gameId, ships, indexPlayer } = JSON.parse(message);
  const currentGame = dbGames.find(({ idGame }) => idGame === gameId);
  const gameBot = dbBot.find(({ idGame }) => idGame === gameId);
  let gameType;
  if (currentGame && currentGame.gameType === "multiplayer") {
    gameType = "multiplayer";
  } else if (gameBot && gameBot.gameType === "bot") {
    gameType = "bot";
  }
  console.log(gameType);
  switch (gameType) {
    case "multiplayer":
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
        turnHandler(currentGame, false);
      }
      break;
    case "bot":
      console.log("not implemented");
    default:
      break;
  }
};
