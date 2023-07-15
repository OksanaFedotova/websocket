import WebSocket from "ws";
import { IResponse } from "../types/IResponse";
import IUserWS from "../types/IUserWs";

export default (
  clients: Set<WebSocket> | IUserWS[],
  response: IResponse,
  message: string
) => {
  console.log(message, JSON.stringify(response));
  clients.forEach((client) => client.send(JSON.stringify(response)));
};
