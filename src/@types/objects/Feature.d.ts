declare namespace Feature {
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
  interface Properties {
    auction_id: string;
    feature_id: string;
    cps: string;
    promotion_type?: PromotionTypes;
    icon?: string;
    advertizer?: string;
    category?: string;
    address_ja?: string;
    address_en?: string;
    address_remarks?: string;
    name_ja?: string;
    name_en?: string;
    subtitle?: string;
    summary?: string;
    phone_number?: string;
    promotion_banner?: string;
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
    profile?: Profile;
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
  type Profile = {
    news?: boolean;
    products?: boolean;
    media?: boolean;
  };
}
declare interface Feature extends mapboxgl.MapboxGeoJSONFeature {
  properties: Feature.Properties;
  geometry: GeoJSON.Geometry;
}
declare type FeatureLog = {
  feature: Feature;
  startActionType?: string;
  endActionType?: string;
  startZoomLevel?: number;
  endZoomLevel?: number;
  visibleStartTime?: number;
  visibleEndTime?: number;
}
