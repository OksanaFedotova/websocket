import IUserWS from "./IUserWs";

interface IGame {
  idGame: number;
  clients?: IUserWS[];
  idPlayer: number;
};
export default IGame;
