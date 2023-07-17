import IShip from "./IShip";
import IUserWS from "./IUserWs";

interface IBotGame {
  idGame: number;
  user: IUserWS;
  startGame: number;
  currentPlayer: IUserWS;
  bot: IShip[];
  turn: number;
  gameType: string;
  botIndex: number;
}
export default IBotGame;
