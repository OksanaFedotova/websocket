import WebSocket from "ws";
import dbGames from "../../../db/dbGames";
import IShip from "../../../types/IShip";
import IUserWS from "../../../types/IUserWs";
import finishHandler from "./finishHandler";
import turnHandler from "./turnHandler";
import winnersHandler from "./winnersHandler";

const getCoordinates = (num: number, length: number) => {
  let res = [];
  for (let i = 0; i < length; i++) {
    res.push(num);
    num++;
  }
  return res;
};
const calcEmptyEls = (arr: (number | undefined)[]) => {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      res++;
    }
  }
  return res;
};
const getDamagedCells = (ship: IShip, x: number, y: number) => {
  let status;
  if (ship.direction) {
    if (ship.coordinates.x === x) {
      if (typeof ship.coordinates.y === "object") {
        const coorY = ship.coordinates.y;
        coorY.forEach((coor, i) => {
          if (coor === y) {
            delete coorY[i];
            const damagedCells = calcEmptyEls(coorY);
            status = damagedCells === coorY.length ? "killed" : "shot";
          }
        });
      }
    }
  } else {
    if (ship.coordinates.y === y) {
      if (typeof ship.coordinates.x === "object") {
        const coorX = ship.coordinates.x;
        coorX.forEach((coor, i) => {
          if (coor === x) {
            delete coorX[i];
            const damagedCells = calcEmptyEls(coorX);
            status = damagedCells === coorX.length ? "killed" : "shot";
          }
        });
      }
    }
  }
  return status;
};
export default (message: string, clients: Set<WebSocket>) => {
  const { x, y, gameId, indexPlayer } = JSON.parse(message);
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
        if (enemy.ships) {
          const finish = finishHandler(
            enemy.ships,
            indexPlayer
            //currentPlayer?.name || ""
          );
          currentGame.clients.forEach((client) =>
            client.send(JSON.stringify(response))
          );
          if (finish) {
            response = finish;
            const responseWinersUpdate = winnersHandler(currentPlayer?.name);
            clients.forEach((client) =>
              client.send(JSON.stringify(responseWinersUpdate))
            );
          }
        }
      }
    }
  }
};
