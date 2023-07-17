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
import { calcEmptyEls } from "../../../utils/utils";

const checkCoordinates = (
  point: number,
  arr: number[],
  a: number,
  b: number
) => {
  let status;
  if (point === a) {
    arr.forEach((coor, i) => {
      if (coor === b) {
        delete arr[i];
        const damagedCells = calcEmptyEls(arr);
        status = damagedCells === arr.length ? "killed" : "shot";
      }
    });
  }
  return status;
};

const getDamagedCells = (ship: IShip, x: number, y: number) => {
  let status;
  if (ship.direction) {
    if (
      typeof ship.coordinates!.x === "number" &&
      typeof ship.coordinates!.y === "object"
    ) {
      status = checkCoordinates(ship.coordinates!.x, ship.coordinates!.y, x, y);
    }
  } else {
    if (
      typeof ship.coordinates!.y === "number" &&
      typeof ship.coordinates!.x === "object"
    ) {
      status = checkCoordinates(ship.coordinates!.y, ship.coordinates!.x, y, x);
    }
  }
  return status;
};
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
          }
        }
      }
      //
    }
  } else {
    const gameBot = dbBot.find(({ idGame }) => idGame === gameId);
    // if (gameBot?.currentPlayer !== indexPlayer) {
    //   console.log("not your turn");
    //   return;
    // } else {
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
    let response = {
      type: "attack",
      data: data,
      id: 0,
    };
    if (statusResponse == "miss" || statusResponse == "kill") {
      turnHandler(gameBot!, true);
    }
    gameBot?.user.send(JSON.stringify(response));
    const finish = finishHandler(gameBot?.bot!, indexPlayer);
    if (finish) {
      broadcast([gameBot?.user!], finish, "for game users");
      winnersHandler(gameBot!.user.name, clients, true);
    }
    // }
  }
};
//JSON.stringify({"type":"add_ships","data":"{\"gameId\":0,\"ships\":[{\"position\":{\"x\":6,\"y\":5},\"direction\":true,\"type\":\"huge\",\"length\":4},{\"position\":{\"x\":2,\"y\":0},\"direction\":true,\"type\":\"large\",\"length\":3},{\"position\":{\"x\":5,\"y\":3},\"direction\":false,\"type\":\"large\",\"length\":3},{\"position\":{\"x\":7,\"y\":0},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":4,\"y\":0},\"direction\":false,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":2,\"y\":6},\"direction\":false,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":8,\"y\":6},\"direction\":true,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":8,\"y\":8},\"direction\":true,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":0,\"y\":7},\"direction\":false,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":0,\"y\":1},\"direction\":false,\"type\":\"small\",\"length\":1}],\"indexPlayer\":1}","id":0})
