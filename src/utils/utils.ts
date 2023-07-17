import IShip from "../types/IShip";
import IUserWS from "../types/IUserWs";

const getArray = (length: number) =>
  Array.from({ length: length }, (_, index) => index);

const deleteCells = (arr: number[], x: number, y: number, length: number) => {
  for (let i = 0; i < length + 1; i++) {
    let yArr = 10 * y + i * 10;
    let xArr = yArr + x;
    delete arr[xArr];
    if (xArr + 1 < yArr + 9) {
      delete arr[xArr + 1];
    }
    if (xArr - 1 > yArr) {
      delete arr[xArr - 1];
    }
  }
};
const getOccupiedCells = (
  arr: number[],
  direction: boolean,
  x: number,
  y: number,
  length: number
) => {
  if (direction) {
    deleteCells(arr, x, y, length);
  } else {
    deleteCells(arr, y, x, length);
  }
};

const checkCoordinates = (arr: number[], x: number, coor: number[]) =>
  coor.some((el) => {
    const num = el * 10 + x;
    return arr.includes(num);
  });

const calcEmptyEls = (arr: (number | undefined)[]) => {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      res++;
    }
  }
  return res;
};
const checkAttack = (x: number, y: number, currentPlayer: IUserWS) =>
  currentPlayer.attacks.some(
    (attack) => JSON.stringify(attack) === JSON.stringify({ x, y })
  );

const checkStatus = (point: number, arr: number[], a: number, b: number) => {
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
      status = checkStatus(ship.coordinates!.x, ship.coordinates!.y, x, y);
    }
  } else {
    if (
      typeof ship.coordinates!.y === "number" &&
      typeof ship.coordinates!.x === "object"
    ) {
      status = checkStatus(ship.coordinates!.y, ship.coordinates!.x, y, x);
    }
  }
  return status;
};
export {
  getArray,
  checkCoordinates,
  getOccupiedCells,
  calcEmptyEls,
  checkAttack,
  getDamagedCells,
};
