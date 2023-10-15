import { COLORS } from 'utils/color';
import { fetchRemoteConfig } from 'utils/remote-config';

export const createLayer = async (id: string, sourceId: string, remoteConfigUrl?: string): Promise<mapboxgl.SymbolLayer> => {

  const defaultConfig = {
    // zoom is 17 (or less)    -> icon size will be 0.8
    // zoom is 20 (or greater) -> icon size will be 1.1
    icon_size: [17, 0.8, 20, 1.1],

    // zoom is 17 (or less)    -> text size will be 11.0
    // zoom is 20 (or greater) -> text size will be 15.0
    text_size: [17, 11.0, 20, 15.0],

    text_opacity: 14,
    text_font: ["Noto Sans CJK JP Medium"],
    text_halo_color: COLORS.FONT_HALO_COLOR_DARK, // "#ffffff",
    text_halo_width: 1.0, // 1.2,
    text_justify: "left" as "center" | "left" | "right" | "auto",
    // 'darkmode' is used in mobile app but not in web
    //darkmode: {
    //  text_halo_color: "#2A3241",
    //},
  };


  const remoteConfig = await fetchRemoteConfig(remoteConfigUrl);
  const config = {...defaultConfig, ...remoteConfig};

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
        ...config.icon_size,
      ],
      'icon-anchor': 'bottom',
      'text-field': ['get', 'name'],
      'text-anchor': 'top',
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        ...config.text_size,
      ],
      'text-font': config.text_font,
      'text-justify': config.text_justify,
    },
    paint: {
      'icon-halo-color': COLORS.FONT_COLOR_DARK,
      'icon-halo-width': 1.5,
      'text-color': COLORS.FONT_COLOR_DARK,
      'text-translate': [0, 2],
      'text-translate-anchor': 'viewport',
      'text-opacity': [
        'step',
        ['zoom'],
        0,
        config.text_opacity,
        1
      ],
      'text-halo-color': config.text_halo_color,
      'text-halo-width': config.text_halo_width,
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
