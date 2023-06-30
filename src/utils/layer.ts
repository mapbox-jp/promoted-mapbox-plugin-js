import { COLORS } from 'utils/color';

export const createLayer = (id: string, sourceId: string): mapboxgl.SymbolLayer => ({
  id,
  type: 'symbol',
  source: sourceId,
  layout: {
    'icon-image': ['get', 'icon'],
    'icon-size': [
      'interpolate',
      ['linear'],
      ['zoom'],
      17, 0.8, // zoom is 17 (or less)    -> icon size will be 0.8
      20, 1.1, // zoom is 20 (or greater) -> icon size will be 1.1
    ],
    'icon-anchor': 'bottom',
    'text-field': ['get', 'name'],
    'text-anchor': 'top',
    'text-size': [
      'interpolate',
      ['linear'],
      ['zoom'],
      17, 11.0, // zoom is 17 (or less)    -> text size will be 11.0
      20, 15.0, // zoom is 20 (or greater) -> text size will be 15.0
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
      14,
      1
    ]
  },
  filter: [
    'all',
    ['>=', ['zoom'], ['get', 'min_zoom']],
  ]
});

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
