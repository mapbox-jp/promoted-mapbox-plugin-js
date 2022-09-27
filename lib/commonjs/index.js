'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var isUrl = function isUrl(string) {
  return !!string.match(/https?:\/\//);
};

var COLORS = {
  FONT_COLOR_LIGHT: '#373737',
  FONT_COLOR_DARK: '#6e523c',
  FONT_HALO_COLOR_LIGHT: '#000000',
  FONT_HALO_COLOR_DARK: '#f1f1f1',
  SELECTED_FONT_COLOR_LIGHT: '#373737',
  SELECTED_FONT_COLOR_DARK: '#f1f1f1',
  SELECTED_FONT_HALO_COLOR_LIGHT: '#000000',
  SELECTED_FONT_HALO_COLOR_DARK: '#6e523c'
};
var GEOJSON_TEMPLATE = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
};
var sourceId = 'promoted-source';
var layerId = 'promoted-layer';

var createLayer = function createLayer(id, sourceId) {
  return {
    id: id,
    type: 'symbol',
    source: sourceId,
    layout: {
      'icon-image': ['get', 'icon'],
      'icon-size': ['interpolate', ['exponential', 1.5], ['zoom'], 10, 0.5, 16, 1.0 // zoom is 16 (or greater) -> icon size will be 1.0 
      ],
      'icon-anchor': 'bottom',
      'text-field': ['get', 'name_ja'],
      'text-anchor': 'top',
      'text-size': ['interpolate', ['exponential', 1.5], ['zoom'], 10, 9, 16, 12 // zoom is 16 (or greater) -> text size will be 12
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
      'text-opacity': ['step', ['zoom'], 0, 14, 1]
    },
    filter: ['all', ['>=', ['zoom'], ['get', 'min_zoom']]]
  };
};

var createSelectedTextColor = function createSelectedTextColor(featureId) {
  return ['case', ['==', ['get', 'feature_id'], featureId], COLORS.SELECTED_FONT_COLOR_DARK, COLORS.FONT_COLOR_DARK];
};

var createSelectedTextHaloColor = function createSelectedTextHaloColor(featureId) {
  return ['case', ['==', ['get', 'feature_id'], featureId], COLORS.SELECTED_FONT_HALO_COLOR_DARK, COLORS.FONT_HALO_COLOR_DARK];
};

var Plugin = /*#__PURE__*/function () {
  /**
   * {@link _map}, which is original instance of the Map SDK.
   *
   * @reuqired
   */

  /**
   * {@link _requestingImageIds}, which stores image ids that they are on the requesting process.
   *   When the processes end, this ids will be updated and delete the ids.
   *   This is a peculiar param for Mapbox Map SDK.
   */

  /**
   * {@link _preZoomLevel}, which stores the zoom level that happened last time.
   *   This param is used at the {@link moveend} method to judge what the events trigger,
   *   because moveend event happens by zooming as well, with zoomend event at the same time.
   *   Program have to recognize moveend or zoomend, which one triggered.
   */

  /**
   * {@link _eventListeners}, which is the Dictionary Object that stores the event listeners and layerId.
   *   The layerId is a peculiar param for Mapbox Map SDK, if you does not need it you can change the structure of this.
   *
   * @required
   */
  function Plugin(map) {
    _classCallCheck(this, Plugin);

    _defineProperty(this, "_map", void 0);

    _defineProperty(this, "_requestingImageIds", []);

    _defineProperty(this, "_preZoomLevel", -1);

    _defineProperty(this, "_eventListeners", {});

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


  _createClass(Plugin, [{
    key: "map",
    get: function get() {
      return this._map;
    }
    /**
     * {@link source}, which is to get the source from Mapbox Map SDK.
     */

  }, {
    key: "source",
    get: function get() {
      return this._map.getSource(sourceId);
    }
    /**
     * {@link layer}, which is to get the layer from Mapbox Map SDK.
     */

  }, {
    key: "layer",
    get: function get() {
      return this._map.getLayer(layerId);
    }
    /**
     * {@link zoomLevel}, which is to get current zoom level.
     *
     * @reuqired
     */

  }, {
    key: "zoomLevel",
    get: function get() {
      return this._map.getZoom();
    }
  }, {
    key: "load",
    value: function load(event) {
      this._preZoomLevel = this._map.getZoom();
      var layer = createLayer(layerId, sourceId);

      this._map.addSource(sourceId, GEOJSON_TEMPLATE);

      this._map.addLayer(layer);

      this.eventCallback('load', event);
    }
  }, {
    key: "move",
    value: function move(event) {
      this.eventCallback('move', event);
    }
  }, {
    key: "idle",
    value: function idle(event) {
      this.eventCallback('idle', event);
    }
  }, {
    key: "moveend",
    value: function moveend(event) {
      var isZoomend = this._preZoomLevel !== this.zoomLevel;
      var type = isZoomend ? 'zoomend' : 'moveend';
      this.eventCallback(type, event);
    }
  }, {
    key: "click",
    value: function click(event) {
      this.eventCallback('click', event);
    }
  }, {
    key: "mousemove",
    value: function mousemove(event) {
      this.eventCallback('mousemove', event);
    }
  }, {
    key: "mousemoveOnLayer",
    value: function mousemoveOnLayer(event) {
      this.eventCallback('mousemove', event);
    }
  }, {
    key: "mouseleaveOnLayer",
    value: function mouseleaveOnLayer(event) {
      this.eventCallback('mouseleave', event);
    }
    /**
     * {@link styleImageMissing}, which is to load and add icon images.
     *   This is a peculiar method for Mapbox Map SDK.
     *
     * @param {Object} {id: string} it the object that contains icon url as the id.
     */

  }, {
    key: "styleImageMissing",
    value: function styleImageMissing(event) {
      var _this = this;

      try {
        var imageId = event.id;

        var isRequesting = this._requestingImageIds.find(function (requestingImageId) {
          return requestingImageId === imageId;
        });

        var isRequested = this._map.hasImage(imageId);

        if (!imageId || isRequesting || isRequested) {
          return;
        }

        this._requestingImageIds.push(imageId);

        if (isUrl(imageId)) {
          this._map.loadImage(imageId, function (error, image) {
            _this._requestingImageIds = _this._requestingImageIds.filter(function (requestingImageId) {
              return requestingImageId !== imageId;
            });

            if (error) {
              throw error;
            }

            if (!image) {
              throw new Error('Failed getting image.');
            }

            _this._map.addImage(imageId, image);
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    /**
     * {@link eventCallback}, which is to trigger the callbacks from Map SDK, to the Promoted SDK.
     *
     *
     * @reuqired
     */

  }, {
    key: "eventCallback",
    value: function eventCallback(type, event) {
      var eventListeners = this._eventListeners[type] ? this._eventListeners[type].slice() : [];

      var _iterator = _createForOfIteratorHelper(eventListeners),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var eventListener = _step.value;
          var listener = eventListener.listener,
              _layerId = eventListener.layerId;
          listener.call(this, _objectSpread(_objectSpread({
            type: type
          }, event), {}, {
            layerId: _layerId
          }));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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

  }, {
    key: "on",
    value: function on(type, listener, layerId) {
      var listenerExisted = this._eventListeners[type] && !!this._eventListeners[type].find(function (eventListener) {
        eventListener.listener === listener && eventListener.layerId === layerId;
      });

      if (!listenerExisted) {
        this._eventListeners[type] = this._eventListeners[type] || [];

        this._eventListeners[type].push({
          listener: listener,
          layerId: layerId
        });
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

  }, {
    key: "off",
    value: function off(type, layerId, listener) {
      var index = this._eventListeners[type] && this._eventListeners[type].findIndex(function (eventListener) {
        eventListener.listener === listener && eventListener.layerId === layerId;
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

  }, {
    key: "getBounds",
    value: function getBounds() {
      var bounds = this._map.getBounds();

      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      return {
        ne: {
          lng: ne.lng,
          lat: ne.lat
        },
        nw: {
          lng: ne.lng,
          lat: sw.lat
        },
        se: {
          lng: sw.lng,
          lat: ne.lat
        },
        sw: {
          lng: sw.lng,
          lat: sw.lat
        }
      };
    }
    /**
     * {@link getRenderedFeatures}, which is to get rendered features by the specific point.
     *   If you does not need this method, but it have to be defined as a empty method and to return empty Array Object.
     *
     * @param {Point} point is that to get features by this pointed out.
     * @required
     */

  }, {
    key: "getRenderedFeatures",
    value: function getRenderedFeatures(point) {
      var box = [[point.x, point.y], [point.x + 1, point.y + 1]];

      var selectedFeatures = this._map.queryRenderedFeatures(box, {
        layers: [layerId]
      });

      return selectedFeatures;
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

  }, {
    key: "render",
    value: function render(features, _visibledFeatures, _unvisibledFeatures) {
      this.source && this.source.setData({
        type: 'FeatureCollection',
        features: features
      });
    }
    /**
     * {@link visibleLayer}, which is to display the layer that draws the pormotion icons.
     *   If you does not need this method, but it have to be defined as a empty method.
     *
     * @required
     */

  }, {
    key: "visibleLayer",
    value: function visibleLayer() {
      this._map.setLayoutProperty(layerId, 'visibility', 'visible');
    }
    /**
     * {@link hideLayer}, which is to hide the layer that draws the pormotion icons.
     *   If you does not need this method, but it have to be defined as a empty method.
     *
     * @required
     */

  }, {
    key: "hideLayer",
    value: function hideLayer() {
      this._map.setLayoutProperty(layerId, 'visibility', 'none');
    }
    /**
     * {@link selectFeature}, which is triggered click the feature, to highlight the icon that was clicked.
     *   If you does not need this method, but it have to be defined as a empty method.
     *
     * @param {Feature} feature is clicked on the map.
     * @required
     */

  }, {
    key: "selectFeature",
    value: function selectFeature(feature) {
      var feature_id = feature.properties.feature_id;
      var textColor = createSelectedTextColor(feature_id);
      var textHaloColor = createSelectedTextHaloColor(feature_id);

      this._map.setPaintProperty(layerId, 'text-color', textColor);

      this._map.setPaintProperty(layerId, 'text-halo-color', textHaloColor);
    }
    /**
     * {@link deselectLayer}, which is to disable the feature's highlighting.
     *   If you does not need this method, but it have to be defined as a empty method.
     *
     * @required
     */

  }, {
    key: "deselectLayer",
    value: function deselectLayer() {
      this._map.setPaintProperty(layerId, 'text-color', COLORS.FONT_COLOR_DARK);

      this._map.setPaintProperty(layerId, 'text-halo-color', COLORS.FONT_HALO_COLOR_DARK);
    }
    /**
     * {@link reload}, which is to reload whole process of the Promoted SDK, but this method is for the Client Application.
     *   If you does not need this method, but it have to be defined as a empty method.
     *
     * @required
     */

  }, {
    key: "reload",
    value: function reload() {
      this.layer && this._map.removeLayer(layerId);
      this.source && this._map.removeSource(sourceId);
    }
  }]);

  return Plugin;
}();

exports.Plugin = Plugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9zdHJpbmcudHMiLCIuLi8uLi9zcmMvdXRpbHMvY29sb3IudHMiLCIuLi8uLi9zcmMvdXRpbHMvZ2VvbWV0cnkudHMiLCIuLi8uLi9zcmMvdXRpbHMvY29uZmlnLnRzIiwiLi4vLi4vc3JjL3V0aWxzL2xheWVyLnRzIiwiLi4vLi4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBpc1VybCA9IChzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4gPT4gISFzdHJpbmcubWF0Y2goL2h0dHBzPzpcXC9cXC8vKTtcbiIsImV4cG9ydCBjb25zdCBDT0xPUlMgPSB7XG4gIEZPTlRfQ09MT1JfTElHSFQ6ICcjMzczNzM3JyxcbiAgRk9OVF9DT0xPUl9EQVJLOiAnIzZlNTIzYycsXG4gIEZPTlRfSEFMT19DT0xPUl9MSUdIVDogJyMwMDAwMDAnLFxuICBGT05UX0hBTE9fQ09MT1JfREFSSzogJyNmMWYxZjEnLFxuICBTRUxFQ1RFRF9GT05UX0NPTE9SX0xJR0hUOiAnIzM3MzczNycsXG4gIFNFTEVDVEVEX0ZPTlRfQ09MT1JfREFSSzogJyNmMWYxZjEnLFxuICBTRUxFQ1RFRF9GT05UX0hBTE9fQ09MT1JfTElHSFQ6ICcjMDAwMDAwJyxcbiAgU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0RBUks6ICcjNmU1MjNjJyxcbn07XG4iLCJleHBvcnQgY29uc3QgR0VPSlNPTl9URU1QTEFURTogbWFwYm94Z2wuR2VvSlNPTlNvdXJjZVJhdyA9IHtcbiAgdHlwZTogJ2dlb2pzb24nLFxuICBkYXRhOiB7XG4gICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICBmZWF0dXJlczogW11cbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBsbmdUb1RpbGUgPSAobG5nOiBudW1iZXIsIHo6IG51bWJlcik6IG51bWJlciA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKChsbmcgKyAxODApIC8gMzYwICogTWF0aC5wb3coMiwgeikpO1xufTtcblxuZXhwb3J0IGNvbnN0IGxhdFRvVGlsZSA9IChsYXQ6IG51bWJlciwgejogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKDEgLSBNYXRoLmxvZyhNYXRoLnRhbihsYXQgKiBNYXRoLlBJIC8gMTgwKSArIDEgLyBNYXRoLmNvcyhsYXQgKiBNYXRoLlBJIC8gMTgwKSkgLyBNYXRoLlBJKSAvIDIgKiBNYXRoLnBvdygyLCB6KSk7XG59O1xuXG5leHBvcnQgY29uc3QgY29vcmRpYW50ZVRvVGlsZSA9IChsbmc6IG51bWJlciwgbGF0OiBudW1iZXIsIHo6IG51bWJlcik6IFRpbGUgPT4ge1xuICBjb25zdCB4ID0gbG5nVG9UaWxlKGxuZywgeik7XG4gIGNvbnN0IHkgPSBsYXRUb1RpbGUobGF0LCB6KTtcbiAgcmV0dXJuIHsgeCwgeSwgeiB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHRpbGVUb1F1YWRrZXkgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGxldCBxdWFkS2V5ID0gJyc7XG4gIGZvciAobGV0IGkgPSB6OyBpID4gMDsgaSAtLSkge1xuICAgIGxldCBiID0gMDtcbiAgICBsZXQgbWFzayA9IDEgPDwgKGkgLSAxKTtcbiAgICBpZiAoKHggJiBtYXNrKSAhPT0gMCkgYiArKztcbiAgICBpZiAoKHkgJiBtYXNrKSAhPT0gMCkgYiArPSAyO1xuICAgIHF1YWRLZXkgKz0gYi50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiBxdWFkS2V5O1xufTtcblxuZXhwb3J0IGNvbnN0IHF1YWRrZXlUb1RpbGUgPSAocXVhZGtleTogc3RyaW5nKTogVGlsZSA9PiB7XG4gIGxldCB4ID0gMFxuICBsZXQgeSA9IDBcbiAgbGV0IHogPSBxdWFka2V5Lmxlbmd0aDtcbiAgZm9yIChsZXQgaSA9IHo7IGkgPiAwOyBpIC0tKSB7XG4gICAgbGV0IG1hc2sgPSAxIDw8IChpIC0gMSk7XG4gICAgbGV0IHEgPSArIHF1YWRrZXlbeiAtIGldO1xuICAgIGlmIChxID09PSAxKSB4IHw9IG1hc2s7XG4gICAgaWYgKHEgPT09IDIpIHkgfD0gbWFzaztcbiAgICBpZiAocSA9PT0gMykge1xuICAgICAgeCB8PSBtYXNrO1xuICAgICAgeSB8PSBtYXNrO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyB4LCB5LCB6IH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGlsZUJvdW5kID0gKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBCb3VuZCA9PiB7XG4gIGNvbnN0IG5lID0gdGlsZVRvQ29vcmRpbmF0ZSh4LCB5LCB6KTtcbiAgY29uc3Qgc3cgPSB0aWxlVG9Db29yZGluYXRlKHggKyAxLCB5ICsgMSwgeik7XG4gIHJldHVybiB7XG4gICAgbmU6IHsgbG5nOiBuZS5sbmcsIGxhdDogbmUubGF0IH0sXG4gICAgbnc6IHsgbG5nOiBuZS5sbmcsIGxhdDogc3cubGF0IH0sXG4gICAgc2U6IHsgbG5nOiBzdy5sbmcsIGxhdDogbmUubGF0IH0sXG4gICAgc3c6IHsgbG5nOiBzdy5sbmcsIGxhdDogc3cubGF0IH0sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29ybmVyVGlsZXMgPSAoc3c6IENvb3JkaW5hdGVzLCBuZTogQ29vcmRpbmF0ZXMsIHpvb21MZXZlbDogbnVtYmVyKTogVGlsZUJvdW5kID0+IHtcbiAgY29uc3QgeiA9IE1hdGguZmxvb3Ioem9vbUxldmVsKTtcbiAgY29uc3QgdHN3ID0gY29vcmRpYW50ZVRvVGlsZShzdy5sbmcsIHN3LmxhdCwgeik7XG4gIGNvbnN0IHRuZSA9IGNvb3JkaWFudGVUb1RpbGUobmUubG5nLCBuZS5sYXQsIHopO1xuICByZXR1cm4ge1xuICAgIG5lOiB7IHg6IHRuZS54LCB5OiB0bmUueSwgejogem9vbUxldmVsIH0sXG4gICAgbnc6IHsgeDogdG5lLngsIHk6IHRzdy55LCB6OiB6b29tTGV2ZWwgfSxcbiAgICBzZTogeyB4OiB0c3cueCwgeTogdG5lLnksIHo6IHpvb21MZXZlbCB9LFxuICAgIHN3OiB7IHg6IHRzdy54LCB5OiB0c3cueSwgejogem9vbUxldmVsIH0sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UXVhZGtleXNPbkJvdW5kID0gKHN3OiBDb29yZGluYXRlcywgbmU6IENvb3JkaW5hdGVzLCB6b29tTGV2ZWw6IG51bWJlcikgPT4ge1xuICBjb25zdCB0aWxlQm91bmQgPSBnZXRDb3JuZXJUaWxlcyhuZSwgc3csIHpvb21MZXZlbCk7XG4gIGNvbnN0IHogPSBNYXRoLmZsb29yKHpvb21MZXZlbCk7XG4gIGNvbnN0IHF1YWRrZXlzID0gW107XG4gIGNvbnN0IHRpbGVzID0gW107XG4gIGZvciAobGV0IHggPSB0aWxlQm91bmQubmUueDsgeCA8PSB0aWxlQm91bmQuc3cueDsgeCArKykge1xuICAgIGZvciAobGV0IHkgPSB0aWxlQm91bmQuc3cueTsgeSA8PSB0aWxlQm91bmQubmUueTsgeSArKykge1xuICAgICAgY29uc3QgcXVhZGtleSA9IHRpbGVUb1F1YWRrZXkoeCwgeSwgeik7XG4gICAgICBxdWFka2V5cy5wdXNoKHF1YWRrZXkpO1xuICAgICAgdGlsZXMucHVzaCh7IHgsIHksIHosIHF1YWRrZXkgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgcXVhZGtleXMsXG4gICAgdGlsZXMsXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgY29vcmRpbmF0ZVRvUXVhZGtleSA9IChsbmc6IG51bWJlciwgbGF0OiBudW1iZXIsIHo6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHRpbGVYID0gbG5nVG9UaWxlKGxuZywgeik7XG4gIGNvbnN0IHRpbGVZID0gbGF0VG9UaWxlKGxhdCwgeik7XG4gIHJldHVybiB0aWxlVG9RdWFka2V5KHRpbGVYLCB0aWxlWSwgeik7XG59O1xuXG5leHBvcnQgY29uc3QgdGlsZVRvQ29vcmRpbmF0ZSA9ICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogQ29vcmRpbmF0ZXMgPT4ge1xuICBjb25zdCBuID0gTWF0aC5wb3coMiwgeik7XG4gIGNvbnN0IGxuZyA9IHggLyBuICogMzYwLjAgLSAxODAuMDtcbiAgY29uc3QgbGF0UmFkaXVzID0gTWF0aC5hdGFuKE1hdGguc2luaChNYXRoLlBJICogKDEgLSAyICogeSAvIG4pKSk7XG4gIGNvbnN0IGxhdCA9IGxhdFJhZGl1cyAqIDE4MC4wIC8gTWF0aC5QSTtcbiAgcmV0dXJuIHsgbG5nLCBsYXQgfTtcbn07XG4iLCJleHBvcnQgY29uc3Qgc291cmNlSWQgPSAncHJvbW90ZWQtc291cmNlJztcbmV4cG9ydCBjb25zdCBsYXllcklkID0gJ3Byb21vdGVkLWxheWVyJztcbiIsImltcG9ydCB7IENPTE9SUyB9IGZyb20gJ3V0aWxzL2NvbG9yJztcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxheWVyID0gKGlkOiBzdHJpbmcsIHNvdXJjZUlkOiBzdHJpbmcpOiBtYXBib3hnbC5TeW1ib2xMYXllciA9PiAoe1xuICBpZCxcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHNvdXJjZTogc291cmNlSWQsXG4gIGxheW91dDoge1xuICAgICdpY29uLWltYWdlJzogWydnZXQnLCAnaWNvbiddLFxuICAgICdpY29uLXNpemUnOiBbXG4gICAgICAnaW50ZXJwb2xhdGUnLFxuICAgICAgWydleHBvbmVudGlhbCcsIDEuNV0sXG4gICAgICBbJ3pvb20nXSxcbiAgICAgIDEwLCAwLjUsIC8vIHpvb20gaXMgMTAgKG9yIGxlc3MpICAgIC0+IGljb24gc2l6ZSB3aWxsIGJlIDAuNVxuICAgICAgMTYsIDEuMCwgLy8gem9vbSBpcyAxNiAob3IgZ3JlYXRlcikgLT4gaWNvbiBzaXplIHdpbGwgYmUgMS4wIFxuICAgIF0sXG4gICAgJ2ljb24tYW5jaG9yJzogJ2JvdHRvbScsXG4gICAgJ3RleHQtZmllbGQnOiBbJ2dldCcsICduYW1lX2phJ10sXG4gICAgJ3RleHQtYW5jaG9yJzogJ3RvcCcsXG4gICAgJ3RleHQtc2l6ZSc6IFtcbiAgICAgICdpbnRlcnBvbGF0ZScsXG4gICAgICBbJ2V4cG9uZW50aWFsJywgMS41XSxcbiAgICAgIFsnem9vbSddLFxuICAgICAgMTAsIDksICAvLyB6b29tIGlzIDEwIChvciBsZXNzKSAgICAtPiB0ZXh0IHNpemUgd2lsbCBiZSA5XG4gICAgICAxNiwgMTIsIC8vIHpvb20gaXMgMTYgKG9yIGdyZWF0ZXIpIC0+IHRleHQgc2l6ZSB3aWxsIGJlIDEyXG4gICAgXVxuICB9LFxuICBwYWludDoge1xuICAgICdpY29uLWhhbG8tY29sb3InOiBDT0xPUlMuRk9OVF9DT0xPUl9EQVJLLFxuICAgICdpY29uLWhhbG8td2lkdGgnOiAxLjUsXG4gICAgJ3RleHQtY29sb3InOiBDT0xPUlMuRk9OVF9DT0xPUl9EQVJLLFxuICAgICd0ZXh0LWhhbG8tY29sb3InOiBDT0xPUlMuRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gICAgJ3RleHQtaGFsby13aWR0aCc6IDEuMCxcbiAgICAndGV4dC10cmFuc2xhdGUnOiBbMCwgMl0sXG4gICAgJ3RleHQtdHJhbnNsYXRlLWFuY2hvcic6ICd2aWV3cG9ydCcsXG4gICAgJ3RleHQtb3BhY2l0eSc6IFtcbiAgICAgICdzdGVwJyxcbiAgICAgIFsnem9vbSddLFxuICAgICAgMCxcbiAgICAgIDE0LFxuICAgICAgMVxuICAgIF1cbiAgfSxcbiAgZmlsdGVyOiBbXG4gICAgJ2FsbCcsXG4gICAgWyc+PScsIFsnem9vbSddLCBbJ2dldCcsICdtaW5fem9vbSddXSxcbiAgXVxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTZWxlY3RlZFRleHRDb2xvciA9IChmZWF0dXJlSWQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gW1xuICAgICdjYXNlJyxcbiAgICBbJz09JywgWydnZXQnLCAnZmVhdHVyZV9pZCddLCBmZWF0dXJlSWRdLFxuICAgIENPTE9SUy5TRUxFQ1RFRF9GT05UX0NPTE9SX0RBUkssXG4gICAgQ09MT1JTLkZPTlRfQ09MT1JfREFSSyxcbiAgXTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVTZWxlY3RlZFRleHRIYWxvQ29sb3IgPSAoZmVhdHVyZUlkOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIFtcbiAgICAnY2FzZScsXG4gICAgWyc9PScsIFsnZ2V0JywgJ2ZlYXR1cmVfaWQnXSwgZmVhdHVyZUlkXSxcbiAgICBDT0xPUlMuU0VMRUNURURfRk9OVF9IQUxPX0NPTE9SX0RBUkssXG4gICAgQ09MT1JTLkZPTlRfSEFMT19DT0xPUl9EQVJLLFxuICBdO1xufTtcbiIsImltcG9ydCBtYXBib3hnbCBmcm9tICdtYXBib3gtZ2wnO1xuaW1wb3J0IHsgaXNVcmwgfSBmcm9tICd1dGlscy9zdHJpbmcnO1xuaW1wb3J0IHsgQ09MT1JTIH0gZnJvbSAndXRpbHMvY29sb3InO1xuaW1wb3J0IHsgR0VPSlNPTl9URU1QTEFURSB9IGZyb20gJ3V0aWxzL2dlb21ldHJ5JztcbmltcG9ydCB7IHNvdXJjZUlkLCBsYXllcklkIH0gZnJvbSAndXRpbHMvY29uZmlnJztcbmltcG9ydCB7XG4gIGNyZWF0ZUxheWVyLFxuICBjcmVhdGVTZWxlY3RlZFRleHRDb2xvcixcbiAgY3JlYXRlU2VsZWN0ZWRUZXh0SGFsb0NvbG9yLFxufSBmcm9tICd1dGlscy9sYXllcic7XG5cbmNsYXNzIFBsdWdpbiBpbXBsZW1lbnRzIFByb21vdGVkTWFwLlBsdWdpbiB7XG4gIC8qKlxuICAgKiB7QGxpbmsgX21hcH0sIHdoaWNoIGlzIG9yaWdpbmFsIGluc3RhbmNlIG9mIHRoZSBNYXAgU0RLLlxuICAgKiBcbiAgICogQHJldXFpcmVkXG4gICAqL1xuICBwcml2YXRlIF9tYXA6IG1hcGJveGdsLk1hcDtcblxuICAvKipcbiAgICoge0BsaW5rIF9yZXF1ZXN0aW5nSW1hZ2VJZHN9LCB3aGljaCBzdG9yZXMgaW1hZ2UgaWRzIHRoYXQgdGhleSBhcmUgb24gdGhlIHJlcXVlc3RpbmcgcHJvY2Vzcy5cbiAgICogICBXaGVuIHRoZSBwcm9jZXNzZXMgZW5kLCB0aGlzIGlkcyB3aWxsIGJlIHVwZGF0ZWQgYW5kIGRlbGV0ZSB0aGUgaWRzLlxuICAgKiAgIFRoaXMgaXMgYSBwZWN1bGlhciBwYXJhbSBmb3IgTWFwYm94IE1hcCBTREsuXG4gICAqL1xuICBwcml2YXRlIF9yZXF1ZXN0aW5nSW1hZ2VJZHM6IHN0cmluZ1tdID0gW107XG5cbiAgLyoqXG4gICAqIHtAbGluayBfcHJlWm9vbUxldmVsfSwgd2hpY2ggc3RvcmVzIHRoZSB6b29tIGxldmVsIHRoYXQgaGFwcGVuZWQgbGFzdCB0aW1lLlxuICAgKiAgIFRoaXMgcGFyYW0gaXMgdXNlZCBhdCB0aGUge0BsaW5rIG1vdmVlbmR9IG1ldGhvZCB0byBqdWRnZSB3aGF0IHRoZSBldmVudHMgdHJpZ2dlcixcbiAgICogICBiZWNhdXNlIG1vdmVlbmQgZXZlbnQgaGFwcGVucyBieSB6b29taW5nIGFzIHdlbGwsIHdpdGggem9vbWVuZCBldmVudCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKiAgIFByb2dyYW0gaGF2ZSB0byByZWNvZ25pemUgbW92ZWVuZCBvciB6b29tZW5kLCB3aGljaCBvbmUgdHJpZ2dlcmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJlWm9vbUxldmVsOiBudW1iZXIgPSAtMTtcblxuICAvKipcbiAgICoge0BsaW5rIF9ldmVudExpc3RlbmVyc30sIHdoaWNoIGlzIHRoZSBEaWN0aW9uYXJ5IE9iamVjdCB0aGF0IHN0b3JlcyB0aGUgZXZlbnQgbGlzdGVuZXJzIGFuZCBsYXllcklkLlxuICAgKiAgIFRoZSBsYXllcklkIGlzIGEgcGVjdWxpYXIgcGFyYW0gZm9yIE1hcGJveCBNYXAgU0RLLCBpZiB5b3UgZG9lcyBub3QgbmVlZCBpdCB5b3UgY2FuIGNoYW5nZSB0aGUgc3RydWN0dXJlIG9mIHRoaXMuXG4gICAqIFxuICAgKiBAcmVxdWlyZWRcbiAgICovXG4gIHByaXZhdGUgX2V2ZW50TGlzdGVuZXJzOiBQcm9tb3RlZE1hcC5FdmVudExpc3RlbmVycyA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG1hcDogbWFwYm94Z2wuTWFwKSB7XG4gICAgdGhpcy5fbWFwID0gbWFwO1xuICAgIHRoaXMuX21hcC5vbignbG9hZCcsIHRoaXMubG9hZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ21vdmUnLCB0aGlzLm1vdmUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbWFwLm9uKCdpZGxlJywgdGhpcy5pZGxlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignbW92ZWVuZCcsIHRoaXMubW92ZWVuZC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ3pvb21lbmQnLCB0aGlzLm1vdmVlbmQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbWFwLm9uKCdjbGljaycsIGxheWVySWQsIHRoaXMuY2xpY2suYmluZCh0aGlzKSk7XG4gICAgdGhpcy5fbWFwLm9uKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ21vdXNlbW92ZScsIGxheWVySWQsIHRoaXMubW91c2Vtb3ZlT25MYXllci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLl9tYXAub24oJ21vdXNlbGVhdmUnLCBsYXllcklkLCB0aGlzLm1vdXNlbGVhdmVPbkxheWVyLmJpbmQodGhpcykpO1xuICAgIHRoaXMuX21hcC5vbignc3R5bGVpbWFnZW1pc3NpbmcnLCB0aGlzLnN0eWxlSW1hZ2VNaXNzaW5nLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAbGluayBtYXB9LCB3aGljaCBpcyB0byBnZXQgdGhlIG1hcCBpbnN0YW5jZSBmcm9tIFB1Ymxpc2hlcidzIFNESy5cbiAgICpcbiAgICogQHJlcXVpcmVkXG4gICAqL1xuICBnZXQgbWFwKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXA7XG4gIH1cblxuICAvKipcbiAgICoge0BsaW5rIHNvdXJjZX0sIHdoaWNoIGlzIHRvIGdldCB0aGUgc291cmNlIGZyb20gTWFwYm94IE1hcCBTREsuXG4gICAqL1xuICBnZXQgc291cmNlKCk6IG1hcGJveGdsLkdlb0pTT05Tb3VyY2Uge1xuICAgIHJldHVybiB0aGlzLl9tYXAuZ2V0U291cmNlKHNvdXJjZUlkKSBhcyBtYXBib3hnbC5HZW9KU09OU291cmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAbGluayBsYXllcn0sIHdoaWNoIGlzIHRvIGdldCB0aGUgbGF5ZXIgZnJvbSBNYXBib3ggTWFwIFNESy5cbiAgICovXG4gIGdldCBsYXllcigpOiBtYXBib3hnbC5TeW1ib2xMYXllciB7XG4gICAgcmV0dXJuIHRoaXMuX21hcC5nZXRMYXllcihsYXllcklkKSBhcyBtYXBib3hnbC5TeW1ib2xMYXllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGxpbmsgem9vbUxldmVsfSwgd2hpY2ggaXMgdG8gZ2V0IGN1cnJlbnQgem9vbSBsZXZlbC5cbiAgICogXG4gICAqIEByZXVxaXJlZFxuICAgKi9cbiAgZ2V0IHpvb21MZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwLmdldFpvb20oKTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZChldmVudDogbWFwYm94Z2wuTWFwYm94RXZlbnQpIHtcbiAgICB0aGlzLl9wcmVab29tTGV2ZWwgPSB0aGlzLl9tYXAuZ2V0Wm9vbSgpO1xuICAgIGNvbnN0IGxheWVyID0gY3JlYXRlTGF5ZXIobGF5ZXJJZCwgc291cmNlSWQpO1xuICAgIHRoaXMuX21hcC5hZGRTb3VyY2Uoc291cmNlSWQsIEdFT0pTT05fVEVNUExBVEUpO1xuICAgIHRoaXMuX21hcC5hZGRMYXllcihsYXllcik7XG4gICAgdGhpcy5ldmVudENhbGxiYWNrKCdsb2FkJywgZXZlbnQgYXMgUHJvbW90ZWRNYXAuRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlKGV2ZW50OiBtYXBib3hnbC5NYXBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5ldmVudENhbGxiYWNrKCdtb3ZlJywgZXZlbnQgYXMgUHJvbW90ZWRNYXAuRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpZGxlKGV2ZW50OiBtYXBib3hnbC5NYXBib3hFdmVudCkge1xuICAgIHRoaXMuZXZlbnRDYWxsYmFjaygnaWRsZScsIGV2ZW50IGFzIFByb21vdGVkTWFwLkV2ZW50KTtcbiAgfVxuICBcbiAgcHJpdmF0ZSBtb3ZlZW5kKGV2ZW50OiBtYXBib3hnbC5NYXBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgaXNab29tZW5kID0gdGhpcy5fcHJlWm9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbDtcbiAgICBjb25zdCB0eXBlID0gaXNab29tZW5kID8gJ3pvb21lbmQnIDogJ21vdmVlbmQnO1xuICAgIHRoaXMuZXZlbnRDYWxsYmFjayh0eXBlLCBldmVudCk7XG4gIH1cblxuICBwcml2YXRlIGNsaWNrKGV2ZW50OiBtYXBib3hnbC5NYXBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5ldmVudENhbGxiYWNrKCdjbGljaycsIGV2ZW50IGFzIFByb21vdGVkTWFwLkV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgbW91c2Vtb3ZlKGV2ZW50OiBtYXBib3hnbC5NYXBMYXllck1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmV2ZW50Q2FsbGJhY2soJ21vdXNlbW92ZScsIGV2ZW50IGFzIFByb21vdGVkTWFwLkV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgbW91c2Vtb3ZlT25MYXllcihldmVudDogbWFwYm94Z2wuTWFwTGF5ZXJNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5ldmVudENhbGxiYWNrKCdtb3VzZW1vdmUnLCBldmVudCBhcyBQcm9tb3RlZE1hcC5FdmVudCk7XG4gIH1cblxuICBwcml2YXRlIG1vdXNlbGVhdmVPbkxheWVyKGV2ZW50OiBtYXBib3hnbC5NYXBMYXllck1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmV2ZW50Q2FsbGJhY2soJ21vdXNlbGVhdmUnLCBldmVudCBhcyBQcm9tb3RlZE1hcC5FdmVudCk7XG4gIH1cblxuICAvKipcbiAgICoge0BsaW5rIHN0eWxlSW1hZ2VNaXNzaW5nfSwgd2hpY2ggaXMgdG8gbG9hZCBhbmQgYWRkIGljb24gaW1hZ2VzLlxuICAgKiAgIFRoaXMgaXMgYSBwZWN1bGlhciBtZXRob2QgZm9yIE1hcGJveCBNYXAgU0RLLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0ge2lkOiBzdHJpbmd9IGl0IHRoZSBvYmplY3QgdGhhdCBjb250YWlucyBpY29uIHVybCBhcyB0aGUgaWQuXG4gICAqL1xuICBwcml2YXRlIHN0eWxlSW1hZ2VNaXNzaW5nKGV2ZW50OiB7IGlkOiBzdHJpbmcgfSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbWFnZUlkOiBzdHJpbmcgPSBldmVudC5pZDtcbiAgICAgIGNvbnN0IGlzUmVxdWVzdGluZyA9IHRoaXMuX3JlcXVlc3RpbmdJbWFnZUlkcy5maW5kKHJlcXVlc3RpbmdJbWFnZUlkID0+IHJlcXVlc3RpbmdJbWFnZUlkID09PSBpbWFnZUlkKTtcbiAgICAgIGNvbnN0IGlzUmVxdWVzdGVkID0gdGhpcy5fbWFwLmhhc0ltYWdlKGltYWdlSWQpO1xuICAgICAgaWYgKCFpbWFnZUlkIHx8IGlzUmVxdWVzdGluZyB8fCBpc1JlcXVlc3RlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9yZXF1ZXN0aW5nSW1hZ2VJZHMucHVzaChpbWFnZUlkKTtcbiAgICAgIGlmIChpc1VybChpbWFnZUlkKSkge1xuICAgICAgICB0aGlzLl9tYXAubG9hZEltYWdlKGltYWdlSWQsIChlcnJvcj86IEVycm9yLCBpbWFnZT86IEhUTUxJbWFnZUVsZW1lbnQgfCBJbWFnZUJpdG1hcCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3JlcXVlc3RpbmdJbWFnZUlkcyA9IHRoaXMuX3JlcXVlc3RpbmdJbWFnZUlkcy5maWx0ZXIocmVxdWVzdGluZ0ltYWdlSWQgPT4gcmVxdWVzdGluZ0ltYWdlSWQgIT09IGltYWdlSWQpO1xuICAgICAgICAgIGlmIChlcnJvcikgeyB0aHJvdyBlcnJvcjsgfVxuICAgICAgICAgIGlmICghaW1hZ2UpIHsgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgZ2V0dGluZyBpbWFnZS4nKTsgfVxuICAgICAgICAgIHRoaXMuX21hcC5hZGRJbWFnZShpbWFnZUlkLCBpbWFnZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB7QGxpbmsgZXZlbnRDYWxsYmFja30sIHdoaWNoIGlzIHRvIHRyaWdnZXIgdGhlIGNhbGxiYWNrcyBmcm9tIE1hcCBTREssIHRvIHRoZSBQcm9tb3RlZCBTREsuXG4gICAqIFxuICAgKiBcbiAgICogQHJldXFpcmVkXG4gICAqL1xuICBwcml2YXRlIGV2ZW50Q2FsbGJhY2sodHlwZTogc3RyaW5nLCBldmVudDogUHJvbW90ZWRNYXAuRXZlbnQpIHtcbiAgICBjb25zdCBldmVudExpc3RlbmVycyA9IHRoaXMuX2V2ZW50TGlzdGVuZXJzW3R5cGVdID8gdGhpcy5fZXZlbnRMaXN0ZW5lcnNbdHlwZV0uc2xpY2UoKSA6IFtdO1xuICAgIGZvciAoY29uc3QgZXZlbnRMaXN0ZW5lciBvZiBldmVudExpc3RlbmVycykge1xuICAgICAgY29uc3QgeyBsaXN0ZW5lciwgbGF5ZXJJZCB9ID0gZXZlbnRMaXN0ZW5lcjtcbiAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgeyB0eXBlLCAuLi5ldmVudCwgbGF5ZXJJZCB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICoge0BsaW5rIG9ufSwgd2hpY2ggaXMgdG8gcmVnaXN0ZXIgdGhlIGV2ZW50IGxpc3RlbmVyIHRoYXQgbWFrZXMgY2FsbGJhY2sgdG8gdGhlIFByb21vdGVkIFNESyBvciBDbGllbnQgQXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIGlzIHRoZSB0eXBlIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0ge2FueX0gbGlzdGVuZXIgaXMgdGhlIGxpc3RlbmVyIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0ge3N0cmluZz99IGxheWVySWQgaXMgdGhhdCBmaWx0ZXJzIHRoZSBldmVudHMgYnkgd2hpY2ggbGF5ZXIgZG9lcyB0aGUgZXZlbnQgaGFwcGVuIG9uLlxuICAgKiAgIFRoaXMgaXMgYSBwZWN1bGlhciBwYXJhbSBmb3IgTWFwYm94IE1hcCBTREsuXG4gICAqIEByZXF1aXJlZFxuICAgKi8gIFxuICBwdWJsaWMgb24odHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogYW55LCBsYXllcklkPzogc3RyaW5nKSB7XG4gICAgY29uc3QgbGlzdGVuZXJFeGlzdGVkID0gdGhpcy5fZXZlbnRMaXN0ZW5lcnNbdHlwZV0gJiYgISF0aGlzLl9ldmVudExpc3RlbmVyc1t0eXBlXS5maW5kKChldmVudExpc3RlbmVyOiBhbnkpID0+IHtcbiAgICAgIGV2ZW50TGlzdGVuZXIubGlzdGVuZXIgPT09IGxpc3RlbmVyICYmIGV2ZW50TGlzdGVuZXIubGF5ZXJJZCA9PT0gbGF5ZXJJZFxuICAgIH0pO1xuICAgIGlmICghbGlzdGVuZXJFeGlzdGVkKSB7XG4gICAgICB0aGlzLl9ldmVudExpc3RlbmVyc1t0eXBlXSA9IHRoaXMuX2V2ZW50TGlzdGVuZXJzW3R5cGVdIHx8IFtdO1xuICAgICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnNbdHlwZV0ucHVzaCh7IGxpc3RlbmVyLCBsYXllcklkIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB7QGxpbmsgb2ZmfSB3aGljaCBpcyB0byB1bnJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyIHRoYXQgcmVkaXN0ZXJlZCBieSB0aGUgb24gbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBpcyB0aGUgdHlwZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIHthbnl9IGxpc3RlbmVyIGlzIHRoZSBsaXN0ZW5lciBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIHtzdHJpbmc/fSBsYXllcklkIGlzIHRoYXQgZmlsdGVycyB0aGUgZXZlbnRzIGJ5IHdoaWNoIGxheWVyIGRvZXMgdGhlIGV2ZW50IGhhcHBlbiBvbi5cbiAgICogICBUaGlzIGlzIGEgcGVjdWxpYXIgcGFyYW0gZm9yIE1hcGJveCBNYXAgU0RLLlxuICAgKiBAcmVxdWlyZWRcbiAgICovICBcbiAgcHVibGljIG9mZih0eXBlOiBzdHJpbmcsIGxheWVySWQ6IGFueSwgbGlzdGVuZXI/OiBhbnkpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2V2ZW50TGlzdGVuZXJzW3R5cGVdICYmIHRoaXMuX2V2ZW50TGlzdGVuZXJzW3R5cGVdLmZpbmRJbmRleCgoZXZlbnRMaXN0ZW5lcjogYW55KSA9PiB7XG4gICAgICBldmVudExpc3RlbmVyLmxpc3RlbmVyID09PSBsaXN0ZW5lciAmJiBldmVudExpc3RlbmVyLmxheWVySWQgPT09IGxheWVySWRcbiAgICB9KTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLl9ldmVudExpc3RlbmVyc1t0eXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB7QGxpbmsgZ2V0Qm91bmRzfSwgd2hpY2ggaXMgdG8gZ2V0IGJvdW5kIHRoYXQgaXMgZHJhd24gb24gdGhlIGNhbnZhcyBieSBjb29yZGluYXRlcyBvZiBkZWdyZWUuXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb3VuZH0gaGF2ZSB0byBiZSBkZWZpbmVkIGFzIGEgT2JqZWN0IHRoYXQgY29udGFpbnMgbm9ydGgtZWFzdCBhbmQgbm9ydGgtd2VzdCwgc291dGgtZWFzdCwgc291dGgtd2VzdC5cbiAgICogQHJlcXVpcmVkXG4gICAqL1xuICBwdWJsaWMgZ2V0Qm91bmRzKCk6IEJvdW5kIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLl9tYXAuZ2V0Qm91bmRzKCk7XG4gICAgY29uc3QgbmUgPSBib3VuZHMuZ2V0Tm9ydGhFYXN0KCk7XG4gICAgY29uc3Qgc3cgPSBib3VuZHMuZ2V0U291dGhXZXN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5lOiB7IGxuZzogbmUubG5nLCBsYXQ6IG5lLmxhdCB9LFxuICAgICAgbnc6IHsgbG5nOiBuZS5sbmcsIGxhdDogc3cubGF0IH0sXG4gICAgICBzZTogeyBsbmc6IHN3LmxuZywgbGF0OiBuZS5sYXQgfSxcbiAgICAgIHN3OiB7IGxuZzogc3cubG5nLCBsYXQ6IHN3LmxhdCB9LFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB7QGxpbmsgZ2V0UmVuZGVyZWRGZWF0dXJlc30sIHdoaWNoIGlzIHRvIGdldCByZW5kZXJlZCBmZWF0dXJlcyBieSB0aGUgc3BlY2lmaWMgcG9pbnQuXG4gICAqICAgSWYgeW91IGRvZXMgbm90IG5lZWQgdGhpcyBtZXRob2QsIGJ1dCBpdCBoYXZlIHRvIGJlIGRlZmluZWQgYXMgYSBlbXB0eSBtZXRob2QgYW5kIHRvIHJldHVybiBlbXB0eSBBcnJheSBPYmplY3QuXG4gICAqIFxuICAgKiBAcGFyYW0ge1BvaW50fSBwb2ludCBpcyB0aGF0IHRvIGdldCBmZWF0dXJlcyBieSB0aGlzIHBvaW50ZWQgb3V0LlxuICAgKiBAcmVxdWlyZWRcbiAgICovXG4gIHB1YmxpYyBnZXRSZW5kZXJlZEZlYXR1cmVzKHBvaW50OiBQb2ludCk6IEZlYXR1cmVbXSB7XG4gICAgY29uc3QgYm94OiBbbWFwYm94Z2wuUG9pbnRMaWtlLCBtYXBib3hnbC5Qb2ludExpa2VdID0gW1xuICAgICAgW3BvaW50LngsIHBvaW50LnldLFxuICAgICAgW3BvaW50LnggKyAxLCBwb2ludC55ICsgMV0sXG4gICAgXTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVzID0gdGhpcy5fbWFwLnF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyhib3gsIHtcbiAgICAgIGxheWVyczogW2xheWVySWRdXG4gICAgfSk7XG4gICAgcmV0dXJuIHNlbGVjdGVkRmVhdHVyZXMgYXMgRmVhdHVyZVtdO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAbGluayByZW5kZXJ9LCB3aGljaCBpcyB0byByZW5kZXIgaWNvbnMgb24gdGhlIG1hcC5cbiAgICogICBIb3cgdG8gcmVuZGVyIGljb25zIG9uIHRoZSBtYXAgaXMgZGVwZW5kaW5nIG9uIHRoZSBQdWJsaXNoZXIncyBTREsuXG4gICAqXG4gICAqIEBwYXJhbSB7RmVhdHVyZVtdfSBmZWF0dXJlcyBpcyBhbGwgZmVhdHVyZXMgdGhhdCBzdG9yZXMgb24gdGhlIG1lbW9yeS5cbiAgICogQHBhcmFtIHtGZWF0dXJlW119IHZpc2libGVkRmVhdHVyZXMgaXMgdGhlIGZlYXR1cmVzIHRoZXkgYXJlIHZpc2libGUgb24gdGhlIGN1cnJlbnQgYm91bmQuXG4gICAqIEBwYXJhbSB7RmVhdHVyZVtdfSB1bnZpc2libGVkRmVhdHVyZXMgaXMgdGhlIGZlYXR1cmVzIHRoZXkgY2hhbmdlIHRvIGJlIHVudmlzaWJsZSwgYnkgbW92aW5nIG91dCBvZiB0aGUgYm91bmQsIG9yIHpvb21pbmcgaW4gb3Igb3V0IHRvIHRhcmdldCB2aXNpYmxlIGZlYXR1cmVzLlxuICAgKiBAcmVxdWlyZWRcbiAgICovXG4gIHB1YmxpYyByZW5kZXIoXG4gICAgZmVhdHVyZXM6IEZlYXR1cmVbXSxcbiAgICBfdmlzaWJsZWRGZWF0dXJlczogRmVhdHVyZVtdLFxuICAgIF91bnZpc2libGVkRmVhdHVyZXM6IEZlYXR1cmVbXVxuICApIHtcbiAgICB0aGlzLnNvdXJjZSAmJiB0aGlzLnNvdXJjZS5zZXREYXRhKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlcyxcbiAgICB9KTtcbiAgfVxuICBcbiAgLyoqXG4gICAqIHtAbGluayB2aXNpYmxlTGF5ZXJ9LCB3aGljaCBpcyB0byBkaXNwbGF5IHRoZSBsYXllciB0aGF0IGRyYXdzIHRoZSBwb3Jtb3Rpb24gaWNvbnMuXG4gICAqICAgSWYgeW91IGRvZXMgbm90IG5lZWQgdGhpcyBtZXRob2QsIGJ1dCBpdCBoYXZlIHRvIGJlIGRlZmluZWQgYXMgYSBlbXB0eSBtZXRob2QuXG4gICAqIFxuICAgKiBAcmVxdWlyZWRcbiAgICovXG4gIHB1YmxpYyB2aXNpYmxlTGF5ZXIoKSB7XG4gICAgdGhpcy5fbWFwLnNldExheW91dFByb3BlcnR5KGxheWVySWQsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGxpbmsgaGlkZUxheWVyfSwgd2hpY2ggaXMgdG8gaGlkZSB0aGUgbGF5ZXIgdGhhdCBkcmF3cyB0aGUgcG9ybW90aW9uIGljb25zLlxuICAgKiAgIElmIHlvdSBkb2VzIG5vdCBuZWVkIHRoaXMgbWV0aG9kLCBidXQgaXQgaGF2ZSB0byBiZSBkZWZpbmVkIGFzIGEgZW1wdHkgbWV0aG9kLlxuICAgKiBcbiAgICogQHJlcXVpcmVkXG4gICAqL1xuICBwdWJsaWMgaGlkZUxheWVyKCkge1xuICAgIHRoaXMuX21hcC5zZXRMYXlvdXRQcm9wZXJ0eShsYXllcklkLCAndmlzaWJpbGl0eScsICdub25lJyk7XG4gIH1cblxuICAvKipcbiAgICoge0BsaW5rIHNlbGVjdEZlYXR1cmV9LCB3aGljaCBpcyB0cmlnZ2VyZWQgY2xpY2sgdGhlIGZlYXR1cmUsIHRvIGhpZ2hsaWdodCB0aGUgaWNvbiB0aGF0IHdhcyBjbGlja2VkLlxuICAgKiAgIElmIHlvdSBkb2VzIG5vdCBuZWVkIHRoaXMgbWV0aG9kLCBidXQgaXQgaGF2ZSB0byBiZSBkZWZpbmVkIGFzIGEgZW1wdHkgbWV0aG9kLlxuICAgKiBcbiAgICogQHBhcmFtIHtGZWF0dXJlfSBmZWF0dXJlIGlzIGNsaWNrZWQgb24gdGhlIG1hcC5cbiAgICogQHJlcXVpcmVkXG4gICAqL1xuICBwdWJsaWMgc2VsZWN0RmVhdHVyZShmZWF0dXJlOiBGZWF0dXJlKSB7XG4gICAgY29uc3QgeyBmZWF0dXJlX2lkIH0gPSBmZWF0dXJlLnByb3BlcnRpZXM7XG4gICAgY29uc3QgdGV4dENvbG9yID0gY3JlYXRlU2VsZWN0ZWRUZXh0Q29sb3IoZmVhdHVyZV9pZCk7XG4gICAgY29uc3QgdGV4dEhhbG9Db2xvciA9IGNyZWF0ZVNlbGVjdGVkVGV4dEhhbG9Db2xvcihmZWF0dXJlX2lkKTtcbiAgICB0aGlzLl9tYXAuc2V0UGFpbnRQcm9wZXJ0eShsYXllcklkLCAndGV4dC1jb2xvcicsIHRleHRDb2xvcik7XG4gICAgdGhpcy5fbWFwLnNldFBhaW50UHJvcGVydHkobGF5ZXJJZCwgJ3RleHQtaGFsby1jb2xvcicsIHRleHRIYWxvQ29sb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAbGluayBkZXNlbGVjdExheWVyfSwgd2hpY2ggaXMgdG8gZGlzYWJsZSB0aGUgZmVhdHVyZSdzIGhpZ2hsaWdodGluZy5cbiAgICogICBJZiB5b3UgZG9lcyBub3QgbmVlZCB0aGlzIG1ldGhvZCwgYnV0IGl0IGhhdmUgdG8gYmUgZGVmaW5lZCBhcyBhIGVtcHR5IG1ldGhvZC5cbiAgICogXG4gICAqIEByZXF1aXJlZFxuICAgKi9cbiAgcHVibGljIGRlc2VsZWN0TGF5ZXIoKSB7XG4gICAgdGhpcy5fbWFwLnNldFBhaW50UHJvcGVydHkoXG4gICAgICBsYXllcklkLFxuICAgICAgJ3RleHQtY29sb3InLFxuICAgICAgQ09MT1JTLkZPTlRfQ09MT1JfREFSSyxcbiAgICApO1xuICAgIHRoaXMuX21hcC5zZXRQYWludFByb3BlcnR5KFxuICAgICAgbGF5ZXJJZCxcbiAgICAgICd0ZXh0LWhhbG8tY29sb3InLFxuICAgICAgQ09MT1JTLkZPTlRfSEFMT19DT0xPUl9EQVJLLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICoge0BsaW5rIHJlbG9hZH0sIHdoaWNoIGlzIHRvIHJlbG9hZCB3aG9sZSBwcm9jZXNzIG9mIHRoZSBQcm9tb3RlZCBTREssIGJ1dCB0aGlzIG1ldGhvZCBpcyBmb3IgdGhlIENsaWVudCBBcHBsaWNhdGlvbi5cbiAgICogICBJZiB5b3UgZG9lcyBub3QgbmVlZCB0aGlzIG1ldGhvZCwgYnV0IGl0IGhhdmUgdG8gYmUgZGVmaW5lZCBhcyBhIGVtcHR5IG1ldGhvZC5cbiAgICpcbiAgICogQHJlcXVpcmVkXG4gICAqL1xuICBwdWJsaWMgcmVsb2FkKCkge1xuICAgIHRoaXMubGF5ZXIgJiYgdGhpcy5fbWFwLnJlbW92ZUxheWVyKGxheWVySWQpO1xuICAgIHRoaXMuc291cmNlICYmIHRoaXMuX21hcC5yZW1vdmVTb3VyY2Uoc291cmNlSWQpO1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIFBsdWdpbixcbn07XG4iXSwibmFtZXMiOlsiaXNVcmwiLCJzdHJpbmciLCJtYXRjaCIsIkNPTE9SUyIsIkZPTlRfQ09MT1JfTElHSFQiLCJGT05UX0NPTE9SX0RBUksiLCJGT05UX0hBTE9fQ09MT1JfTElHSFQiLCJGT05UX0hBTE9fQ09MT1JfREFSSyIsIlNFTEVDVEVEX0ZPTlRfQ09MT1JfTElHSFQiLCJTRUxFQ1RFRF9GT05UX0NPTE9SX0RBUksiLCJTRUxFQ1RFRF9GT05UX0hBTE9fQ09MT1JfTElHSFQiLCJTRUxFQ1RFRF9GT05UX0hBTE9fQ09MT1JfREFSSyIsIkdFT0pTT05fVEVNUExBVEUiLCJ0eXBlIiwiZGF0YSIsImZlYXR1cmVzIiwic291cmNlSWQiLCJsYXllcklkIiwiY3JlYXRlTGF5ZXIiLCJpZCIsInNvdXJjZSIsImxheW91dCIsInBhaW50IiwiZmlsdGVyIiwiY3JlYXRlU2VsZWN0ZWRUZXh0Q29sb3IiLCJmZWF0dXJlSWQiLCJjcmVhdGVTZWxlY3RlZFRleHRIYWxvQ29sb3IiLCJQbHVnaW4iLCJtYXAiLCJfbWFwIiwib24iLCJsb2FkIiwiYmluZCIsIm1vdmUiLCJpZGxlIiwibW92ZWVuZCIsImNsaWNrIiwibW91c2Vtb3ZlIiwibW91c2Vtb3ZlT25MYXllciIsIm1vdXNlbGVhdmVPbkxheWVyIiwic3R5bGVJbWFnZU1pc3NpbmciLCJnZXRTb3VyY2UiLCJnZXRMYXllciIsImdldFpvb20iLCJldmVudCIsIl9wcmVab29tTGV2ZWwiLCJsYXllciIsImFkZFNvdXJjZSIsImFkZExheWVyIiwiZXZlbnRDYWxsYmFjayIsImlzWm9vbWVuZCIsInpvb21MZXZlbCIsImltYWdlSWQiLCJpc1JlcXVlc3RpbmciLCJfcmVxdWVzdGluZ0ltYWdlSWRzIiwiZmluZCIsInJlcXVlc3RpbmdJbWFnZUlkIiwiaXNSZXF1ZXN0ZWQiLCJoYXNJbWFnZSIsInB1c2giLCJsb2FkSW1hZ2UiLCJlcnJvciIsImltYWdlIiwiRXJyb3IiLCJhZGRJbWFnZSIsImNvbnNvbGUiLCJldmVudExpc3RlbmVycyIsIl9ldmVudExpc3RlbmVycyIsInNsaWNlIiwiZXZlbnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiY2FsbCIsImxpc3RlbmVyRXhpc3RlZCIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwiYm91bmRzIiwiZ2V0Qm91bmRzIiwibmUiLCJnZXROb3J0aEVhc3QiLCJzdyIsImdldFNvdXRoV2VzdCIsImxuZyIsImxhdCIsIm53Iiwic2UiLCJwb2ludCIsImJveCIsIngiLCJ5Iiwic2VsZWN0ZWRGZWF0dXJlcyIsInF1ZXJ5UmVuZGVyZWRGZWF0dXJlcyIsImxheWVycyIsIl92aXNpYmxlZEZlYXR1cmVzIiwiX3VudmlzaWJsZWRGZWF0dXJlcyIsInNldERhdGEiLCJzZXRMYXlvdXRQcm9wZXJ0eSIsImZlYXR1cmUiLCJmZWF0dXJlX2lkIiwicHJvcGVydGllcyIsInRleHRDb2xvciIsInRleHRIYWxvQ29sb3IiLCJzZXRQYWludFByb3BlcnR5IiwicmVtb3ZlTGF5ZXIiLCJyZW1vdmVTb3VyY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLElBQU1BLEtBQUssR0FBRyxTQUFSQSxLQUFRLENBQUNDLE1BQUQ7RUFBQSxPQUE2QixDQUFDLENBQUNBLE1BQU0sQ0FBQ0MsS0FBUCxDQUFhLGFBQWIsQ0FBL0I7QUFBQSxDQUFkOztBQ0FBLElBQU1DLE1BQU0sR0FBRztFQUNwQkMsZ0JBQWdCLEVBQUUsU0FERTtFQUVwQkMsZUFBZSxFQUFFLFNBRkc7RUFHcEJDLHFCQUFxQixFQUFFLFNBSEg7RUFJcEJDLG9CQUFvQixFQUFFLFNBSkY7RUFLcEJDLHlCQUF5QixFQUFFLFNBTFA7RUFNcEJDLHdCQUF3QixFQUFFLFNBTk47RUFPcEJDLDhCQUE4QixFQUFFLFNBUFo7RUFRcEJDLDZCQUE2QixFQUFFO0FBUlgsQ0FBZjtBQ0FBLElBQU1DLGdCQUFnQixHQUE4QjtFQUN6REMsSUFBSSxFQUFFLFNBRG1EO0VB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
