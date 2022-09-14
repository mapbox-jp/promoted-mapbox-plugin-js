declare type Coordinate = {
  lng: number;
  lat: number;
};
declare type Point = {
  x: number;
  y: number;
};
declare type Tile = {
  x: number;
  y: number;
  z: number;
};
declare type Bound = {
  ne: Coordinate;
  nw: Coordinate;
  se: Coordinate;
  sw: Coordinate;
};
declare type TileBound = {
  ne: Tile;
  nw: Tile;
  se: Tile;
  sw: Tile;
};
