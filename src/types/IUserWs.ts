import { WebSocket } from "ws";
import IShip from "./IShip";

interface IUserWS extends WebSocket {
  name: string;
  index: number;
  ships?: IShip[];
  inGame?: boolean;
}
export default IUserWS;
