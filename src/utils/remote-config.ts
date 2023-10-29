//cf.)
//MapboxPromoted/Common/Service/RemoteConfigAPIService.swift
//MapboxPromoted/Common/Model/RemoteConfigResponse.swift

/* old V1 config */
/*
interface Variant {
  'id': string; // id
  'srv-LkK4AFWPk4': boolean; // 'adServerEnabled'. no longer used
  'log-E7x94uKQtW': boolean; // 'logServerEnabled'. no longer used
  'stl-4Tw7tKQMCz'?: number[]; // 'textFontSizeTransition'
  'stl-X82wUUiLH6'?: number[]; // 'iconScaleTransition'
  'stl-CnKRZqY6wr'?: number; // 'textOpacity'
}
interface RemoteConfigJson {
  id: string; // id
  variantA: Variant;
  variantB: Variant;
  weight: number;
};
const RemoteConfigMapping: {[key: string]: string} = {
  "id": 'id', // String,
  "stl-4Tw7tKQMCz": 'textFontSizeTransition', // Double[]?
  "stl-X82wUUiLH6": 'iconScaleTransition', // Double[]?
  "stl-CnKRZqY6wr": 'textOpacity', // int?
};
interface RemoteConfig {
  'id'?: string;
  'textFontSizeTransition'?: number[];
  'iconScaleTransition'?: number[];
  'textOpacity'?: number;
}
*/

interface RemoteConfig {
  'id': string;
  'icon_size'?: number[];
  'text_size'?: number[];
  'text_opacity'?: number; // e.g.) 14
  'text_font'?: string[]; // ["Noto Sans CJK JP Medium "]
  'text_halo_color_rgba'?: string; // '#ffffff“,
  'text_halo_width'?: number; // 1.2,
  'text_justify'?: "center" | "left" | "right" | "auto"; //'left'
  'darkmode'? : {
     'text_halo_color_rgba'?: string; // '#545a66'
  };
};
interface RemoteConfigJson {
  id: string; // id
  variantA: RemoteConfig;
  variantB: RemoteConfig;
  weight: number;
  feature_flags? : {
     campaign_cta?: boolean;
  };
};

export const fetchRemoteConfig = async (url?: string): Promise<RemoteConfig> => {
  if (!url) return {} as RemoteConfig;
  const res = await fetch(url);
  const config = await res.json() as RemoteConfigJson;
  const variant = (Math.random() * 100.0 < config.weight ?
      config.variantA : config.variantB);
  return variant;
};

