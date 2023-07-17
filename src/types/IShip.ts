import Ships from "./Ships";

interface IShip {
  status?: undefined | string;
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: Ships;
  coordinates?: {
    x: number[] | number;
    y: number[] | number;
  };
}
export default IShip;
