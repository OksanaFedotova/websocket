import WebSocket from "ws";
import registrationHandler from "./commandsHandlers/registrationHandler";
import createRoomHandler from "./commandsHandlers/createRoomHandler";
import IUserWS from '../../types/IUserWs';
import { IResponse } from "../../types/IResponse";
import addUserHandler from "./commandsHandlers/addUserHandler";

export const handler = (wsClient: WebSocket, data: string, clients: WebSocket.Server["clients"]) => {
  console.log(`ws-client: ${data}`);
  const message = JSON.parse(data);
  const type = message.type;
  let response: IResponse | undefined;
  switch(type) {
    case "reg":
      response =  registrationHandler(message.data, wsClient as IUserWS);
      if (response) wsClient.send(JSON.stringify(response));
    break;
    case "create_room": 
      response = createRoomHandler(message.data, wsClient as IUserWS);
      if (response) clients.forEach((client) => client.send(JSON.stringify(response)));
    break;
    case "add_user_to_room":
      addUserHandler(message.data, wsClient as IUserWS);
    }
}
