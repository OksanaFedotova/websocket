import { WebSocket } from "ws";
import IShip from "./IShip";

interface IUserWS extends WebSocket {
  name: string;
  index: number;
  ships?: IShip[];
  inGame?: boolean;
  attacks: { x: number; y: number }[];
}
export default IUserWS;
