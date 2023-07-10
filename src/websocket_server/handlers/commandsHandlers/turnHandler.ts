import IUserWS from "../../../types/IUserWs";

export default (users: IUserWS[], num: number) => {
  let data = JSON.stringify({
    currentPlayer: num,
  });
  const response = {
    type: "turn",
    data: data,
    id: 0,
  };
  users.forEach((user) => {
    user.send(JSON.stringify(response));
  });
};
