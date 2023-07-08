import { WebSocket } from 'ws';
import dbUsers from '../../db/dbUsers';
import {IRegReq} from '../../types/IResponse';
import IUser from '../../types/IUser';

export default (message: string, _ws: WebSocket) => {
  const {name, password} = JSON.parse(message);
  let resData = {
    name: name,
    index: dbUsers.size, 
    error: false,
    errorText: '',
  };
  const response: IRegReq = {
    type: "reg",
    data: JSON.stringify(resData),
    id: 0,
}
  const existingUser: IUser = dbUsers.get(name);
  if (existingUser) {
    existingUser.password === password ? resData = {...resData, index: existingUser.index } : 
      resData = {...resData, error: true, errorText: 'wrong password'}
    } else {
      dbUsers.set(name, {name, password, index: dbUsers.size})
    }
  return response;
}