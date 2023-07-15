import IGame from "../../../types/IGame";
import IUserWS from "../../../types/IUserWs";

export default (currentGame: IGame, change: boolean) => {
  if (change) currentGame.turn = +!currentGame.turn;
  let data = JSON.stringify({
    currentPlayer: currentGame.clients[currentGame.turn].index,
  });
  const response = {
    type: "turn",
    data: data,
    id: 0,
  };
  currentGame.clients.forEach((user) => {
    user.send(JSON.stringify(response));
  });
};
