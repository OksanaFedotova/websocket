import { WebSocket } from 'ws';
interface IUserWS extends WebSocket {
  name: string,
  index: number
}
export default IUserWS;
