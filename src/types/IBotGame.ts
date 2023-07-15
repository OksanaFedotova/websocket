import IUserWS from "./IUserWs";

interface IBotGame{
  idGame: number;
  user: IUserWS;
  startGame: number,
  currentPlayer: IUserWS,
  turn: number,
}
export default IBotGame;