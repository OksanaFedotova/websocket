import IUserWS from './IUserWs';

interface IRoom {
  roomId: number;
  roomUsers: IUserWS[];
}
export default IRoom;
