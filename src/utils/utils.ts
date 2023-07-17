const getArray = (length: number) =>
  Array.from({ length: length }, (_, index) => index);
const deleteCells = (arr: number[], x: number, y: number, length: number) => {
  for (let i = 0; i < length + 1; i++) {
    let yArr = 10 * y + i * 10;
    let xArr = yArr + x;
    delete arr[xArr];
    if (xArr + 1 < yArr + 9) {
      delete arr[xArr + 1];
    }
    if (xArr - 1 > yArr) {
      delete arr[xArr - 1];
    }
  }
};
const getOccupiedCells = (
  arr: number[],
  direction: boolean,
  x: number,
  y: number,
  length: number
) => {
  if (direction) {
    deleteCells(arr, x, y, length);
  } else {
    deleteCells(arr, y, x, length);
  }
};

const checkCoordinates = (arr: number[], x: number, coor: number[]) => {
  return !coor.some((el) => {
    const num = el * 10 + x;
    return arr.includes(num);
  });
};
const calcEmptyEls = (arr: (number | undefined)[]) => {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      res++;
    }
  }
  return res;
};
export { calcEmptyEls };
