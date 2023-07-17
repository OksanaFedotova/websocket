import WebSocket from "ws";
import dbGames from "../../../db/dbGames";
import IShip from "../../../types/IShip";
import finishHandler from "./finishHandler";
import turnHandler from "./turnHandler";
import winnersHandler from "./winnersHandler";
import broadcast from "../../../utils/broadcast";
import getCoordinates from "../../../utils/getCoordinates";
import dbBot from "../../../db/dbBot";
import randomInteger from "../../../utils/randomInteger";
import {
  calcEmptyEls,
  checkAttack,
  getDamagedCells,
} from "../../../utils/utils";
import IUserWS from "../../../types/IUserWs";
import botAttack from "./bot/botAttack";
export default (message: string, clients: Set<WebSocket>) => {
  let { x, y, gameId, indexPlayer } = JSON.parse(message);
  if (typeof x === "undefined") {
    x = randomInteger(0, 10);
    y = randomInteger(0, 10);
  }
  const currentGame = dbGames.find(({ idGame }) => idGame === gameId);
  if (currentGame) {
    const currentPlayer = currentGame.clients.find(
      ({ index }) => index === indexPlayer
    );
    if (currentPlayer) {
      const turn = currentGame.clients[currentGame.turn].index;
      if (turn !== currentPlayer.index) {
        console.log("not your turn");
        return;
      }
      if (checkAttack(x, y, currentPlayer)) {
        return;
      } else {
        currentPlayer.attacks.push({ x, y });
      }
      const enemy = currentGame.clients.find(
        ({ index }) => index !== indexPlayer
      );
      let statusResponse = "miss";
      if (enemy) {
        if (!enemy.inGame) {
          enemy.ships?.forEach((ship) => {
            ship.coordinates = ship.direction
              ? {
                  x: ship.position.x,
                  y: getCoordinates(ship.position.y, ship.length),
                }
              : {
                  x: getCoordinates(ship.position.x, ship.length),
                  y: ship.position.y,
                };
            let status = getDamagedCells(ship, x, y);
            if (status) {
              statusResponse = status;
              ship.status = status;
            }
          });
          enemy.inGame = true;
        } else {
          enemy?.ships?.forEach((ship) => {
            let status = getDamagedCells(ship, x, y);
            if (status) {
              statusResponse = status;
              ship.status = status;
            }
          });
        }
        let data = JSON.stringify({
          position: {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer,
          status: statusResponse,
        });
        let response = {
          type: "attack",
          data: data,
          id: 0,
        };
        if (statusResponse == "miss" || statusResponse == "kill") {
          turnHandler(currentGame, true);
        }
        currentGame.clients.forEach((client) =>
          client.send(JSON.stringify(response))
        );
        if (enemy.ships) {
          const finish = finishHandler(enemy.ships, indexPlayer);
          if (finish) {
            broadcast(currentGame.clients, finish, "for game users");
            winnersHandler(currentPlayer?.name, clients, true);
            const index = dbGames.findIndex(({ idGame }) => idGame === gameId);
            dbGames.splice(index, 1);
          }
        }
      }
    }
  } else {
    const gameBot = dbBot.find(({ idGame }) => idGame === gameId);
    let response = {
      type: "attack",
      data: "",
      id: 0,
    };
    if (gameBot?.currentPlayer !== indexPlayer) {
      response = botAttack(gameBot!.user, gameBot!.botIndex);
    } else {
      let statusResponse = "miss";
      gameBot?.bot.forEach((ship) => {
        let status = getDamagedCells(ship, x, y);
        if (status) {
          statusResponse = status;
          ship.status = status;
        }
      });
      let data = JSON.stringify({
        position: {
          x: x,
          y: y,
        },
        currentPlayer: indexPlayer,
        status: statusResponse,
      });
      response.data = data;
      if (statusResponse == "miss" || statusResponse == "kill") {
        turnHandler(gameBot!, true);
      }
      gameBot?.user.send(JSON.stringify(response));
      const finish = finishHandler(gameBot?.bot!, indexPlayer);
      if (finish) {
        broadcast([gameBot?.user!], finish, "for game users");
        winnersHandler(gameBot!.user.name, clients, true);
      }
    }
  }
};
