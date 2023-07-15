import dbWinners from "../../../db/dbWinners";

export default (winnerName: string) => {
  //const winner = Array.from(dbUsers.values()).find(({index}) => index === winnerIndex);
  if (dbWinners.some(({ name }) => name === winnerName)) {
    dbWinners.forEach(({ name, wins }) => {
      if (name === winnerName) {
        wins++;
      }
    });
  } else {
    dbWinners.push({ name: winnerName, wins: 1 });
  }
  const data = JSON.stringify(dbWinners);
  const response = {
    type: "update_winners",
    data: data,
    id: 0,
  };
  return response;
};
