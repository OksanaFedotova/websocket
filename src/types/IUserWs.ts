import { WebSocket } from "ws";
interface IUserWS extends WebSocket {
  name: string;
  index: number;
  ships?: [];
}
export default IUserWS;
