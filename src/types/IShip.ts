interface IShip {
  status: undefined | string;
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
  coordinates: {
    x: number[] | number;
    y: number[] | number;
  };
}
export default IShip;
