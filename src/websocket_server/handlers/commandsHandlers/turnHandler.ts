import IBotGame from "../../../types/IBotGame";
import IGame from "../../../types/IGame";

export default (currentGame: IGame | IBotGame, change: boolean) => {
  const response = {
    type: "turn",
    data: "",
    id: 0,
  };
  if (change) currentGame.turn = +!currentGame.turn;
  if (currentGame.hasOwnProperty("clients")) {
    const data = JSON.stringify({
      currentPlayer: (currentGame as IGame).clients[currentGame.turn].index,
    });
    //console.log((currentGame as IGame).clients[currentGame.turn].index);
    response.data = data;
    (currentGame as IGame).clients.forEach((user) => {
      user.send(JSON.stringify(response));
    });
  } else {
    const currentPlayer = currentGame.turn
      ? (currentGame as IBotGame).user.index
      : (currentGame as IBotGame).botIndex;
    const data = JSON.stringify({
      currentPlayer: currentPlayer,
    });
    response.data = data;
    (currentGame as IBotGame).user.send(JSON.stringify(response));
  }
};
