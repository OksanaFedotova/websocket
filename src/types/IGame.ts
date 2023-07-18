import IShip from './IShip';
import IUserWS from './IUserWs';

interface IBot {
  index: number;
  ships?: IShip[];
}

interface IGame {
  idGame: number;
  clients: IUserWS[];
  startGame: number;
  currentPlayer: IUserWS;
  turn: number;
  gameType: string;
}
export default IGame;
