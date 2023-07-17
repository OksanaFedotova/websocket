export default (num: number, length: number) => {
  let res = [];
  for (let i = 0; i < length; i++) {
    res.push(num);
    num++;
  }
  return res;
};
