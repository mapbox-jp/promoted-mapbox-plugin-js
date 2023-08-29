import { COLORS } from 'utils/color';

export const createLayer = async (id: string, sourceId: string, remoteConfigUrl?: string): Promise<mapboxgl.SymbolLayer> => {

  // zoom is 17 (or less)    -> icon size will be 0.8
  // zoom is 20 (or greater) -> icon size will be 1.1
  const DEFAULT_ICON_SIZE = [17, 0.8, 20, 1.1];

  // zoom is 17 (or less)    -> text size will be 11.0
  // zoom is 20 (or greater) -> text size will be 15.0
  const DEFAULT_TEXT_SIZE = [17, 11.0, 20, 15.0];
  const DEFAULT_TEXT_OPACITY = 14;

  const config = await fetchRemoteConfig(remoteConfigUrl);
  const textSizeConf = config?.textFontSizeTransition;
  const iconSizeConf = config?.iconScaleTransition;
  const textSize = (textSizeConf && textSizeConf.length % 2 === 0 ?
      textSizeConf : DEFAULT_TEXT_SIZE);
  const iconSize = (iconSizeConf && iconSizeConf.length % 2 === 0 ?
      iconSizeConf : DEFAULT_ICON_SIZE);
  const textOpacity = config?.textOpacity ?? DEFAULT_TEXT_OPACITY;

  return {
    id,
    type: 'symbol',
    source: sourceId,
    layout: {
      'icon-image': ['get', 'icon'],
      'icon-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        ...iconSize,
      ],
      'icon-anchor': 'bottom',
      'text-field': ['get', 'name'],
      'text-anchor': 'top',
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        ...textSize,
      ]
    },
    paint: {
      'icon-halo-color': COLORS.FONT_COLOR_DARK,
      'icon-halo-width': 1.5,
      'text-color': COLORS.FONT_COLOR_DARK,
      'text-halo-color': COLORS.FONT_HALO_COLOR_DARK,
      'text-halo-width': 1.0,
      'text-translate': [0, 2],
      'text-translate-anchor': 'viewport',
      'text-opacity': [
        'step',
        ['zoom'],
        0,
        textOpacity,
        1
      ]
    },
    filter: [
      'all',
      ['>=', ['zoom'], ['get', 'min_zoom']],
    ]
  };
};

export const createSelectedTextColor = (featureId: string) => {
  return [
    'case',
    ['==', ['get', 'feature_id'], featureId],
    COLORS.SELECTED_FONT_COLOR_DARK,
    COLORS.FONT_COLOR_DARK,
  ];
};

export const createSelectedTextHaloColor = (featureId: string) => {
  return [
    'case',
    ['==', ['get', 'feature_id'], featureId],
    COLORS.SELECTED_FONT_HALO_COLOR_DARK,
    COLORS.FONT_HALO_COLOR_DARK,
  ];
};

//MapboxPromoted/Common/Service/RemoteConfigAPIService.swift
//MapboxPromoted/Common/Model/RemoteConfigResponse.swift
interface Variant {
  'id': string; // id
  'srv-LkK4AFWPk4': boolean; // 'adServerEnabled'. no longer used
  'log-E7x94uKQtW': boolean; // 'logServerEnabled'. no longer used
  'stl-4Tw7tKQMCz'?: Number[]; // 'textFontSizeTransition'
  'stl-X82wUUiLH6'?: Number[]; // 'iconScaleTransition'
  'stl-CnKRZqY6wr'?: Number; // 'textOpacity'
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
  id?: string;
  textFontSizeTransition?: Number[];
  iconScaleTransition?: Number[];
  textOpacity?: Number;
}
const fetchRemoteConfig = async (url?: string): Promise<RemoteConfig | null> => {
  if (!url) return null;
  const res = await fetch(url);
  const config = await res.json() as RemoteConfigJson;
  const variant = (Math.random() * 100.0 < config.weight ?
      config.variantA : config.variantB);

  const ret = {};
  for (const [key, val] of Object.entries(variant)) {
    if (RemoteConfigMapping[key]) {
      ret[RemoteConfigMapping[key]] = val;
    }
  }
  return ret;
};

