import WebSocket from "ws";
import registrationHandler from "./registrationHandler";
import createRoomHandler from "./createRoomHandler";
import IUserWS from '../../types/IUserWs';
import { IResponse } from "../../types/IResponse";

export const handler = (wsClient: WebSocket, data: string, clients: WebSocket.Server["clients"]) => {
  console.log(`ws-client: ${data}`);
  const message = JSON.parse(data);
  const type = message.type;
  let response: IResponse | null;
  switch(type) {
    case "reg":
      response =  registrationHandler(message.data, wsClient as IUserWS);
      wsClient.send(JSON.stringify(response));
    break;
    case "create_room": 
      response = createRoomHandler(message.data, wsClient as IUserWS);
      clients.forEach((client) => client.send(JSON.stringify(response)))
    }
}
