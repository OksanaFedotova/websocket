import IUserWS from "./IUserWs";

interface IBotGame {
  idGame: number;
  user: IUserWS;
  startGame: number;
  currentPlayer: IUserWS;
  turn: number;
  gameType: string;
}
export default IBotGame;
