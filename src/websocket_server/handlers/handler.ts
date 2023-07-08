import WebSocket from "ws";
import registrationHandler from "./registrationHandler";

export const handler = (wsClient: WebSocket, data: string) => {
  console.log(`ws-client: ${data}`);
  const message = JSON.parse(data);
  const type = message.type;
  switch(type) {
    case "reg":
      const response =  registrationHandler(message.data, wsClient);
      wsClient.send(JSON.stringify(response));
  }
}
