export = PromotedPlugin;
export as namespace PromotedPlugin;

declare type Coordinates = {
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
  ne: Coordinates;
  nw: Coordinates;
  se: Coordinates;
  sw: Coordinates;
};
declare type TileBound = {
  ne: Tile;
  nw: Tile;
  se: Tile;
  sw: Tile;
};

declare namespace Feature {
  interface Properties {
    auction_id: string;
    feature_id: string;
    cps: string;
    icon?: string;
    advertizer?: string;
    category?: string;
    address?: string;
    address_remarks?: string;
    name?: string;
    subtitle?: string;
    summary?: string;
    phone_number?: string;
    promotion_banner_width?: number;
    promotion_banner_height?: number;
    promotion_card?: string;
    promotion_url?: string;
    directions?: string;
    lat?: string;
    lng?: string;
    min_zoom?: string;
    business_hours?: string;
    business_hours_remarks?: string;
    external_links?: string;
    profile?: string;
    banner_image?: string;
    banner_video?: string;
  }
  const PROMOTION_TYPES: {
    readonly CARD: 'card';
  }
  type PromotionTypes = typeof PROMOTION_TYPES[keyof typeof PROMOTION_TYPES];
  const EXTERNAL_LINK_TYPES: {
    readonly LINE: 'line';
    readonly INSTAGRAM: 'instagram';
    readonly FACEBOOK: 'facebook';
    readonly TWITTER: 'twitter';
    readonly APP_STORE: 'app_store';
    readonly PLAY_STORE: 'play_store';
  }
  type ExternalLinkTypes = typeof EXTERNAL_LINK_TYPES[keyof typeof EXTERNAL_LINK_TYPES];
  type ExternalLink = {
    type: ExternalLinkTypes;
    url: string;
  };
  namespace Properties {
    type BusinessHours = {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
      sunday?: string;
    };
  }
  namespace Profile {
    type Category = {
      id: string;
      name: string;
    };
    type Image = {
      id: string;
      mime_type: string;
      url: string;
      width: number;
      height: number;
    };
    type Images = {
      small: Image;
      medium: Image;
      large: Image;
    };
    type News = {
      id: string;
      title: string;
      text: string;
      images: Images;
    };
    type Product = {
      id: string;
      category_ids: string[];
      title: string;
      text: string;
      image_url: string;
    };
    type Media = {
      id: string;
      category_ids: string[];
      type: string;
      title?: string;
      images: Images;
    };
  }
  type Profile = {
    news?: boolean;
    products?: boolean;
    media?: boolean;
  };
}
interface Feature extends mapboxgl.MapboxGeoJSONFeature {
  properties: Feature.Properties;
  geometry: GeoJSON.Geometry;
}

declare namespace PromotedPlugin {
  const CLICK_MODE: {
    readonly CLICK: 'click';
    readonly TOUCH: 'touch';
  };
  type ClickMode = typeof CLICK_MODE[keyof typeof CLICK_MODE];
  type Options = {
    clickMode?: ClickMode;
  };
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
  export class Plugin {
    constructor(map: mapboxgl.Map, options?: PromotedPlugin.Options);
    get isPromotedPlugin(): boolean;
    get map(): any;
    get zoomLevel(): number;
    public getBounds(): Bound;
    public getRenderedFeaturesOnBound(): Feature[];
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
    public reset(): void;
  }
}
