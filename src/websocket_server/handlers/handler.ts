import WebSocket from "ws";
import registrationHandler from "./commandsHandlers/registrationHandler";
import createRoomHandler from "./commandsHandlers/createRoomHandler";
import IUserWS from "../../types/IUserWs";
import addUserHandler from "./commandsHandlers/addUserHandler";
import addShipsHandler from "./commandsHandlers/addShipsHandler";
import attackHandler from "./commandsHandlers/attackHandler";
import botHandler from "./commandsHandlers/bot/botHandler";

export const handler = (
  wsClient: WebSocket,
  data: string,
  clients: WebSocket.Server["clients"]
) => {
  console.log(`ws-client: ${data}`);
  const message = JSON.parse(data);
  const type = message.type;
  switch (type) {
    case "reg":
      registrationHandler(message.data, wsClient as IUserWS, clients);
      break;
    case "create_room":
      //console.log(message.type)
      createRoomHandler(message.data, wsClient as IUserWS, clients);
      break;
    case "add_user_to_room":
      addUserHandler(message.data, wsClient as IUserWS, clients);
      break;
    case "add_ships":
      addShipsHandler(message.data, wsClient as IUserWS);
      break;
    case "attack":
    case "randomAttack":
      attackHandler(message.data, clients);
      break;
    case "single_play":
      botHandler(wsClient as IUserWS);
      break;
  }
};
