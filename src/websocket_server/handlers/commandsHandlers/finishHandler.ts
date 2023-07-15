import IShip from "../../../types/IShip";

export default (ships: IShip[], currentPlayer: number) => {
  const killedShips = ships.reduce(
    (acc, { status }) => (status === "killed" ? (acc += 1) : acc),
    0
  );
  if (killedShips === ships.length) {
    const data = JSON.stringify({
      winPlayer: currentPlayer,
    });
    return {
      type: "finish",
      data: data,
      id: 0,
    };
  }
};
