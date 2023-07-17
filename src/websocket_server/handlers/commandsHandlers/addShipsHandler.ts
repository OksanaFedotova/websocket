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
      // const testResponse = JSON.stringify({
      //   type: "start_game",
      //   data: '{"ships":[{"position":{"x":6,"y":5},"direction":true,"type":"huge","length":4},{"position":{"x":2,"y":0},"direction":true,"type":"large","length":3},{"position":{"x":5,"y":3},"direction":false,"type":"large","length":3},{"position":{"x":7,"y":0},"direction":true,"type":"medium","length":2},{"position":{"x":4,"y":0},"direction":false,"type":"medium","length":2},{"position":{"x":2,"y":6},"direction":false,"type":"medium","length":2},{"position":{"x":8,"y":6},"direction":true,"type":"small","length":1},{"position":{"x":8,"y":8},"direction":true,"type":"small","length":1},{"position":{"x":0,"y":7},"direction":false,"type":"small","length":1},{"position":{"x":0,"y":1},"direction":false,"type":"small","length":1}],"currentPlayerIndex":1}',
      //   id: 0,
      // });
      ws.send(JSON.stringify(response));
      //ws.send(testResponse);
      turnHandler(gameBot!, true);
    default:
      break;
  }
};
