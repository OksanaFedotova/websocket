import IUserWS from '../../../../types/IUserWs';
import randomInteger from '../../../../utils/randomInteger';
import { getDamagedCells } from '../../../../utils/utils';

export default (enemy: IUserWS, botIndex: number) => {
  let x = randomInteger(0, 9);
  let y = randomInteger(0, 9);
  let statusResponse = 'miss';
  enemy?.ships?.forEach((ship) => {
    let status = getDamagedCells(ship, x, y);
    if (status) {
      statusResponse = status;
      ship.status = status;
    }
  });
  let data = JSON.stringify({
    position: {
      x: x,
      y: y,
    },
    currentPlayer: botIndex,
    status: statusResponse,
  });
  let response = {
    type: 'attack',
    data: data,
    id: 0,
  };
  return response;
};
