export const GEOJSON_TEMPLATE: mapboxgl.GeoJSONSourceRaw = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  },
};

export const lngToTile = (lng: number, z: number): number => {
  return Math.floor((lng + 180) / 360 * Math.pow(2, z));
};

export const latToTile = (lat: number, z: number): number => {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
};

export const coordianteToTile = (lng: number, lat: number, z: number): Tile => {
  const x = lngToTile(lng, z);
  const y = latToTile(lat, z);
  return { x, y, z };
};

export const tileToQuadkey = (x: number, y: number, z: number): string => {
  let quadKey = '';
  for (let i = z; i > 0; i --) {
    let b = 0;
    let mask = 1 << (i - 1);
    if ((x & mask) !== 0) b ++;
    if ((y & mask) !== 0) b += 2;
    quadKey += b.toString();
  }
  return quadKey;
};

export const quadkeyToTile = (quadkey: string): Tile => {
  let x = 0
  let y = 0
  let z = quadkey.length;
  for (let i = z; i > 0; i --) {
    let mask = 1 << (i - 1);
    let q = + quadkey[z - i];
    if (q === 1) x |= mask;
    if (q === 2) y |= mask;
    if (q === 3) {
      x |= mask;
      y |= mask;
    }
  }
  return { x, y, z };
};

export const getTileBound = (x: number, y: number, z: number): Bound => {
  const ne = tileToCoordinate(x, y, z);
  const sw = tileToCoordinate(x + 1, y + 1, z);
  return {
    ne: { lng: ne.lng, lat: ne.lat },
    nw: { lng: ne.lng, lat: sw.lat },
    se: { lng: sw.lng, lat: ne.lat },
    sw: { lng: sw.lng, lat: sw.lat },
  };
};

export const getCornerTiles = (sw: Coordinates, ne: Coordinates, zoomLevel: number): TileBound => {
  const z = Math.floor(zoomLevel);
  const tsw = coordianteToTile(sw.lng, sw.lat, z);
  const tne = coordianteToTile(ne.lng, ne.lat, z);
  return {
    ne: { x: tne.x, y: tne.y, z: zoomLevel },
    nw: { x: tne.x, y: tsw.y, z: zoomLevel },
    se: { x: tsw.x, y: tne.y, z: zoomLevel },
    sw: { x: tsw.x, y: tsw.y, z: zoomLevel },
  };
};

export const getQuadkeysOnBound = (sw: Coordinates, ne: Coordinates, zoomLevel: number) => {
  const tileBound = getCornerTiles(ne, sw, zoomLevel);
  const z = Math.floor(zoomLevel);
  const quadkeys = [];
  const tiles = [];
  for (let x = tileBound.ne.x; x <= tileBound.sw.x; x ++) {
    for (let y = tileBound.sw.y; y <= tileBound.ne.y; y ++) {
      const quadkey = tileToQuadkey(x, y, z);
      quadkeys.push(quadkey);
      tiles.push({ x, y, z, quadkey });
    }
  }
  return {
    quadkeys,
    tiles,
  };
};

export const coordinateToQuadkey = (lng: number, lat: number, z: number): string => {
  const tileX = lngToTile(lng, z);
  const tileY = latToTile(lat, z);
  return tileToQuadkey(tileX, tileY, z);
};

export const tileToCoordinate = (x: number, y: number, z: number): Coordinates => {
  const n = Math.pow(2, z);
  const lng = x / n * 360.0 - 180.0;
  const latRadius = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
  const lat = latRadius * 180.0 / Math.PI;
  return { lng, lat };
};
