import dbBot from '../../../../db/dbBot';
import IShip from '../../../../types/IShip';
import Ships from '../../../../types/Ships';
import getCoordinates from '../../../../utils/getCoordinates';
import randomInteger from '../../../../utils/randomInteger';
import { checkCoordinates, getOccupiedCells } from '../../../../utils/utils';

const getDirection = () => randomInteger(0, 1);

const getShip = (length: number, type: Ships): IShip => {
  const direction = Boolean(getDirection());
  let x = randomInteger(0, 9);
  let y = randomInteger(0, 9);
  if (direction) {
    while (!checkLength(y, length)) {
      y = randomInteger(0, 9);
    }
  } else {
    while (!checkLength(x, length)) {
      x = randomInteger(0, 9);
    }
  }
  const res = {
    position: {
      x,
      y,
    },
    direction: direction,
    length,
    type,
  };
  return res;
};
const checkLength = (a: number, length: number) => {
  if (a + length < 9) {
    return true;
  }
};
const getShipCoordinates = (ship: IShip) => {
  ship.coordinates = ship.direction
    ? {
        x: ship.position.x,
        y: getCoordinates(ship.position.y, ship.length),
      }
    : {
        x: getCoordinates(ship.position.x, ship.length),
        y: ship.position.y,
      };
};
const addShips = (index: number) => {
  const scheme = [Ships.huge, Ships.large, Ships.medium, Ships.small];
  scheme.forEach((shipType, indexInner) => {
    const length = scheme.length - indexInner;
    for (let i = 0; i < indexInner + 1; i++) {
      let ship = getShip(length, shipType);
      getShipCoordinates(ship);
      if (ship.direction) {
        while (!checkCoordinates(dbBot[index].botMap, ship.position.x, getCoordinates(ship.position.y, ship.length))) {
          ship = getShip(length, shipType);
          getShipCoordinates(ship);
        }
      } else if (!ship.direction) {
        while (!checkCoordinates(dbBot[index].botMap, ship.position.x, getCoordinates(ship.position.x, ship.length))) {
          ship = getShip(length, shipType);
          getShipCoordinates(ship);
        }
      }
      getOccupiedCells(dbBot[index].botMap, ship.direction, ship.position.x, ship.position.y, ship.length);
      dbBot[index].bot.push(ship);
    }
  });
};
export default addShips;
