import { COLORS } from 'utils/color';

export const createLayer = (id: string, sourceId: string): mapboxgl.SymbolLayer => ({
  id,
  type: 'symbol',
  source: sourceId,
  layout: {
    'icon-image': ['get', 'icon'],
    'icon-size': [
      'interpolate',
      ['exponential', 1.5],
      ['zoom'],
      10, 0.5, // zoom is 10 (or less)    -> icon size will be 0.5
      16, 1.0, // zoom is 16 (or greater) -> icon size will be 1.0 
    ],
    'icon-anchor': 'bottom',
    'text-field': ['get', 'name'],
    'text-anchor': 'top',
    'text-size': [
      'interpolate',
      ['exponential', 1.5],
      ['zoom'],
      10, 9,  // zoom is 10 (or less)    -> text size will be 9
      16, 12, // zoom is 16 (or greater) -> text size will be 12
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
