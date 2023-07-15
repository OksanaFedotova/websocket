import IUserWS from "./IUserWs";

interface IGame {
  idGame: number;
  clients: IUserWS[];
  startGame: number;
  currentPlayer: IUserWS;
  turn: number;
  gameType: string;
}
export default IGame;
