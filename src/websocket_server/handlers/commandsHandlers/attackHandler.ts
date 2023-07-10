import dbGames from "../../../db/dbGames";
import IShip from "../../../types/IShip";

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
  console.log("55", status);
  return status;
};
export default (message: string) => {
  const { x, y, gameId, indexPlayer } = JSON.parse(message);
  const currentGame = dbGames.find(({ idGame }) => idGame === gameId);
  const enemy = currentGame?.clients.find(({ index }) => index !== indexPlayer);
  let statusResponse: string | undefined = "miss";
  if (enemy) {
    if (!enemy.inGame) {
      enemy?.ships?.forEach((ship) => {
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
        if (status) statusResponse = status;
      });
      enemy.inGame = true;
    } else {
      enemy?.ships?.forEach((ship) => {
        let status = getDamagedCells(ship, x, y);
        console.log("82", status);
        if (status) statusResponse = status;
      });
    }
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
  console.log(response);
  currentGame?.clients.forEach((client) =>
    client.send(JSON.stringify(response))
  );
};
