import WebSocket from "ws";
import dbWinners from "../../../db/dbWinners";
import { IResponse } from "../../../types/IResponse";
import broadcast from "../../../utils/broadcast";

export default (winnerName: string, clients: Set<WebSocket>) => {
  if (dbWinners.some(({ name }) => name === winnerName)) {
    dbWinners.forEach(({ name, wins }) => {
      if (name === winnerName) {
        wins++;
      }
    });
  } else {
    dbWinners.push({ name: winnerName, wins: 0 });
  }
  const data = JSON.stringify(dbWinners);
  const response: IResponse = {
    type: "update_winners",
    data: data,
    id: 0,
  };
  broadcast(clients, response, "response for all clients:");
};
