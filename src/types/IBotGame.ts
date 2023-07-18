import IShip from './IShip';
import IUserWS from './IUserWs';

interface IBotGame {
  idGame: number;
  user: IUserWS;
  startGame: number;
  currentPlayer: number;
  bot: IShip[];
  turn: number;
  gameType: string;
  botIndex: number;
  botMap: number[];
}
export default IBotGame;
