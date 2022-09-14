declare namespace Promoted {
  namespace MapPlugin {
    type Event = {
      features?: Feature[];
      point?: Point;
    };
    type EventListener = {
      listener: any;
      layerId?: string;
    };
    type EventListeners = {
      [quadkey: string]: EventListener[];
    };
  }
  class MapPlugin {
    constructor(map: mapboxgl.Map, token: string, options?: Promoted.Core.Options);
    get map(): any;
    get zoomLevel(): number;
    public getBounds(): Bound;
    public getRenderedFeatures(point: Point): Feature[];
    public on(type: string, layerId: any, listener?: any): void;
    public off(type: string, layerId: any, listener?: any): void;
    public render(
      features: Feature[],
      visibledFeatures: Feature[],
      unvisibledFeatures: Feature[]
    ): void;
    public visibleLayer(): void;
    public hideLayer(): void;
    public selectFeature(feature: Feature): void;
    public deselectLayer(): void;
    public reload(): void;
  }
}
