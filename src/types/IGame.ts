import IUserWS from "./IUserWs";

interface IGame {
  idGame: number;
  clients: IUserWS[];
  startGame: number;
  currentPlayer: number;
}
export default IGame;
