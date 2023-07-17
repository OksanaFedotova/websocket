import dbBot from "../../../../db/dbBot";
import IShip from "../../../../types/IShip";
import Ships from "../../../../types/Ships";
import getCoordinates from "../../../../utils/getCoordinates";
import randomInteger from "../../../../utils/randomInteger";

const getDirection = () => randomInteger(0, 1);
const getShip = (length: number, type: Ships): IShip => ({
  position: {
    x: randomInteger(0, 10),
    y: randomInteger(0, 10),
  },
  direction: Boolean(getDirection()),
  length,
  type,
});
const addShips = (index: number) => {
  const scheme = [Ships.huge, Ships.large, Ships.medium, Ships.small];
  scheme.forEach((shipType, indexInner) => {
    const length = scheme.length - indexInner;
    for (let i = 0; i < indexInner + 1; i++) {
      const ship = getShip(length, shipType);

      ship.coordinates = ship.direction
        ? {
            x: ship.position.x,
            y: getCoordinates(ship.position.y, ship.length),
          }
        : {
            x: getCoordinates(ship.position.x, ship.length),
            y: ship.position.y,
          };
      dbBot[index].bot.push(ship);
    }
  });
};
export default addShips;
