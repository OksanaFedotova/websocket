import { WebSocket } from "ws";
import dbUsers from "../../../db/dbUsers";
import { IResponse } from "../../../types/IResponse";
import IUserWS from "../../../types/IUserWs";

export default (message: string, wsClient: IUserWS) => {
  const { name, password } = JSON.parse(message);
  let resData = {
    name: name,
    index: dbUsers.size,
    error: false,
    errorText: "",
  };
  const response: IResponse = {
    type: "reg",
    data: JSON.stringify(resData),
    id: 0,
  };
  const existingUser = dbUsers.get(name);
  if (existingUser) {
    existingUser.password === password
      ? (resData = { ...resData, index: existingUser.index })
      : (resData = { ...resData, error: true, errorText: "wrong password" });
    wsClient.name = name;
    wsClient.index = existingUser.index;
  } else {
    dbUsers.set(name, { name, password, index: dbUsers.size });
    wsClient.name = name;
    wsClient.index = dbUsers.size;
  }
  wsClient.send(JSON.stringify(response));
};
