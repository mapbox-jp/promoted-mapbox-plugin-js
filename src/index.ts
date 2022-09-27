import mapboxgl from 'mapbox-gl';
import { isUrl } from 'utils/string';
import { COLORS } from 'utils/color';
import { GEOJSON_TEMPLATE } from 'utils/geometry';
import { sourceId, layerId } from 'utils/config';
import {
  createLayer,
  createSelectedTextColor,
  createSelectedTextHaloColor,
} from 'utils/layer';

class Plugin implements PromotedPlugin.Plugin {
  /**
   * {@link _map}, which is original instance of the Map SDK.
   * 
   * @reuqired
   */
  private _map: mapboxgl.Map;

  /**
   * {@link _requestingImageIds}, which stores image ids that they are on the requesting process.
   *   When the processes end, this ids will be updated and delete the ids.
   *   This is a peculiar param for Mapbox Map SDK.
   */
  private _requestingImageIds: string[] = [];

  /**
   * {@link _preZoomLevel}, which stores the zoom level that happened last time.
   *   This param is used at the {@link moveend} method to judge what the events trigger,
   *   because moveend event happens by zooming as well, with zoomend event at the same time.
   *   Program have to recognize moveend or zoomend, which one triggered.
   */
  private _preZoomLevel: number = -1;

  /**
   * {@link _eventListeners}, which is the Dictionary Object that stores the event listeners and layerId.
   *   The layerId is a peculiar param for Mapbox Map SDK, if you does not need it you can change the structure of this.
   * 
   * @required
   */
  private _eventListeners: PromotedPlugin.EventListeners = {};

  constructor(map: mapboxgl.Map) {
    this._map = map;
    this._map.on('load', this.load.bind(this));
    this._map.on('move', this.move.bind(this));
    this._map.on('idle', this.idle.bind(this));
    this._map.on('moveend', this.moveend.bind(this));
    this._map.on('zoomend', this.moveend.bind(this));
    this._map.on('click', layerId, this.click.bind(this));
    this._map.on('mousemove', this.mousemove.bind(this));
    this._map.on('mousemove', layerId, this.mousemoveOnLayer.bind(this));
    this._map.on('mouseleave', layerId, this.mouseleaveOnLayer.bind(this));
    this._map.on('styleimagemissing', this.styleImageMissing.bind(this));
  }

  /**
   * {@link map}, which is to get the map instance from Publisher's SDK.
   *
   * @required
   */
  get map() {
    return this._map;
  }

  /**
   * {@link source}, which is to get the source from Mapbox Map SDK.
   */
  get source(): mapboxgl.GeoJSONSource {
    return this._map.getSource(sourceId) as mapboxgl.GeoJSONSource;
  }

  /**
   * {@link layer}, which is to get the layer from Mapbox Map SDK.
   */
  get layer(): mapboxgl.SymbolLayer {
    return this._map.getLayer(layerId) as mapboxgl.SymbolLayer;
  }

  /**
   * {@link zoomLevel}, which is to get current zoom level.
   * 
   * @reuqired
   */
  get zoomLevel() {
    return this._map.getZoom();
  }

  private load(event: mapboxgl.MapboxEvent) {
    this._preZoomLevel = this._map.getZoom();
    const layer = createLayer(layerId, sourceId);
    this._map.addSource(sourceId, GEOJSON_TEMPLATE);
    this._map.addLayer(layer);
    this.eventCallback('load', event as PromotedPlugin.Event);
  }

  private move(event: mapboxgl.MapMouseEvent) {
    this.eventCallback('move', event as PromotedPlugin.Event);
  }

  private idle(event: mapboxgl.MapboxEvent) {
    this.eventCallback('idle', event as PromotedPlugin.Event);
  }
  
  private moveend(event: mapboxgl.MapMouseEvent) {
    const isZoomend = this._preZoomLevel !== this.zoomLevel;
    const type = isZoomend ? 'zoomend' : 'moveend';
    this.eventCallback(type, event);
  }

  private click(event: mapboxgl.MapMouseEvent) {
    this.eventCallback('click', event as PromotedPlugin.Event);
  }

  private mousemove(event: mapboxgl.MapLayerMouseEvent) {
    this.eventCallback('mousemove', event as PromotedPlugin.Event);
  }

  private mousemoveOnLayer(event: mapboxgl.MapLayerMouseEvent) {
    this.eventCallback('mousemove', event as PromotedPlugin.Event);
  }

  private mouseleaveOnLayer(event: mapboxgl.MapLayerMouseEvent) {
    this.eventCallback('mouseleave', event as PromotedPlugin.Event);
  }

  /**
   * {@link styleImageMissing}, which is to load and add icon images.
   *   This is a peculiar method for Mapbox Map SDK.
   *
   * @param {Object} {id: string} it the object that contains icon url as the id.
   */
  private styleImageMissing(event: { id: string }) {
    try {
      const imageId: string = event.id;
      const isRequesting = this._requestingImageIds.find(requestingImageId => requestingImageId === imageId);
      const isRequested = this._map.hasImage(imageId);
      if (!imageId || isRequesting || isRequested) {
        return;
      }
      this._requestingImageIds.push(imageId);
      if (isUrl(imageId)) {
        this._map.loadImage(imageId, (error?: Error, image?: HTMLImageElement | ImageBitmap) => {
          this._requestingImageIds = this._requestingImageIds.filter(requestingImageId => requestingImageId !== imageId);
          if (error) { throw error; }
          if (!image) { throw new Error('Failed getting image.'); }
          this._map.addImage(imageId, image);
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  /**
   * {@link eventCallback}, which is to trigger the callbacks from Map SDK, to the Promoted SDK.
   * 
   * 
   * @reuqired
   */
  private eventCallback(type: string, event: PromotedPlugin.Event) {
    const eventListeners = this._eventListeners[type] ? this._eventListeners[type].slice() : [];
    for (const eventListener of eventListeners) {
      const { listener, layerId } = eventListener;
      listener.call(this, { type, ...event, layerId });
    }
  }

  /**
   * {@link on}, which is to register the event listener that makes callback to the Promoted SDK or Client Application.
   *
   * @param {string} type is the type of the event
   * @param {any} listener is the listener of the event
   * @param {string?} layerId is that filters the events by which layer does the event happen on.
   *   This is a peculiar param for Mapbox Map SDK.
   * @required
   */  
  public on(type: string, listener: any, layerId?: string) {
    const listenerExisted = this._eventListeners[type] && !!this._eventListeners[type].find((eventListener: any) => {
      eventListener.listener === listener && eventListener.layerId === layerId
    });
    if (!listenerExisted) {
      this._eventListeners[type] = this._eventListeners[type] || [];
      this._eventListeners[type].push({ listener, layerId });
    }
  }

  /**
   * {@link off} which is to unregister event listener that redistered by the on method.
   *
   * @param {string} type is the type of the event
   * @param {any} listener is the listener of the event
   * @param {string?} layerId is that filters the events by which layer does the event happen on.
   *   This is a peculiar param for Mapbox Map SDK.
   * @required
   */  
  public off(type: string, layerId: any, listener?: any) {
    const index = this._eventListeners[type] && this._eventListeners[type].findIndex((eventListener: any) => {
      eventListener.listener === listener && eventListener.layerId === layerId
    });
    if (index !== -1) {
      this._eventListeners[type].splice(index, 1);
    }
  }

  /**
   * {@link getBounds}, which is to get bound that is drawn on the canvas by coordinates of degree.
   *
   * @returns {Bound} have to be defined as a Object that contains north-east and north-west, south-east, south-west.
   * @required
   */
  public getBounds(): Bound {
    const bounds = this._map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return {
      ne: { lng: ne.lng, lat: ne.lat },
      nw: { lng: ne.lng, lat: sw.lat },
      se: { lng: sw.lng, lat: ne.lat },
      sw: { lng: sw.lng, lat: sw.lat },
    }
  }

  /**
   * {@link getRenderedFeatures}, which is to get rendered features by the specific point.
   *   If you does not need this method, but it have to be defined as a empty method and to return empty Array Object.
   * 
   * @param {Point} point is that to get features by this pointed out.
   * @required
   */
  public getRenderedFeatures(point: Point): Feature[] {
    const box: [mapboxgl.PointLike, mapboxgl.PointLike] = [
      [point.x, point.y],
      [point.x + 1, point.y + 1],
    ];
    const selectedFeatures = this._map.queryRenderedFeatures(box, {
      layers: [layerId]
    });
    return selectedFeatures as Feature[];
  }

  /**
   * {@link render}, which is to render icons on the map.
   *   How to render icons on the map is depending on the Publisher's SDK.
   *
   * @param {Feature[]} features is all features that stores on the memory.
   * @param {Feature[]} visibledFeatures is the features they are visible on the current bound.
   * @param {Feature[]} unvisibledFeatures is the features they change to be unvisible, by moving out of the bound, or zooming in or out to target visible features.
   * @required
   */
  public render(
    features: Feature[],
    _visibledFeatures: Feature[],
    _unvisibledFeatures: Feature[]
  ) {
    this.source && this.source.setData({
      type: 'FeatureCollection',
      features,
    });
  }
  
  /**
   * {@link visibleLayer}, which is to display the layer that draws the pormotion icons.
   *   If you does not need this method, but it have to be defined as a empty method.
   * 
   * @required
   */
  public visibleLayer() {
    this._map.setLayoutProperty(layerId, 'visibility', 'visible');
  }

  /**
   * {@link hideLayer}, which is to hide the layer that draws the pormotion icons.
   *   If you does not need this method, but it have to be defined as a empty method.
   * 
   * @required
   */
  public hideLayer() {
    this._map.setLayoutProperty(layerId, 'visibility', 'none');
  }

  /**
   * {@link selectFeature}, which is triggered click the feature, to highlight the icon that was clicked.
   *   If you does not need this method, but it have to be defined as a empty method.
   * 
   * @param {Feature} feature is clicked on the map.
   * @required
   */
  public selectFeature(feature: Feature) {
    const { feature_id } = feature.properties;
    const textColor = createSelectedTextColor(feature_id);
    const textHaloColor = createSelectedTextHaloColor(feature_id);
    this._map.setPaintProperty(layerId, 'text-color', textColor);
    this._map.setPaintProperty(layerId, 'text-halo-color', textHaloColor);
  }

  /**
   * {@link deselectLayer}, which is to disable the feature's highlighting.
   *   If you does not need this method, but it have to be defined as a empty method.
   * 
   * @required
   */
  public deselectLayer() {
    this._map.setPaintProperty(
      layerId,
      'text-color',
      COLORS.FONT_COLOR_DARK,
    );
    this._map.setPaintProperty(
      layerId,
      'text-halo-color',
      COLORS.FONT_HALO_COLOR_DARK,
    );
  }

  /**
   * {@link reload}, which is to reload whole process of the Promoted SDK, but this method is for the Client Application.
   *   If you does not need this method, but it have to be defined as a empty method.
   *
   * @required
   */
  public reload() {
    this.layer && this._map.removeLayer(layerId);
    this.source && this._map.removeSource(sourceId);
  }
}

export {
  Plugin,
};
