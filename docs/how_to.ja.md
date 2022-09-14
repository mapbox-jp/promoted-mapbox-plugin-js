# Promoted Mapbox Plugin 

## Promoted Pluginについて
Promoted Pluginはマップ広告配信用のPromoted SDKと各種Map SDKとを連携するためのPluginになります。
Map SDKに依存する各種メソッド、APIをPromoted SDKに提供するため仕様を共通化することがPromoted Pluginの目的となります。

## Promoted Plugin必要な実装について
下記URLのPromoted.MapPluginに定義されているクラスと一連のメソッドが必要になります。
https://github.com/mapbox-jp/promoted-mapbox-plugin-js/blob/main/src/@types/index.d.ts#L15


## 実装を行う各種メソッドについて
```
// PublisherのMap SDKインスタンスの取得に必要になります
get map(): any;

// zoomLevelの取得に必要になります
get zoomLevel(): number;

// canvasの四方の座標(North East, North West, South East, South West)を取得します
public getBounds(): Bound;

// 指定された領域内で描画されているfeatureの一覧を取得します
public getRenderedFeatures(point: Point): Feature[];

// コールバックイベントを登録します
public on(type: string, layerId: any, listener?: any): void;

// コールバックイベントを除去します
public off(type: string, layerId: any, listener?: any): void;

// 画面上に広告ピンを描画します
// features: これまで取得されたすべてのfeatureの一覧になります
// visibledFeatures: 画面領域内に存在し、尚且つそのZoomLevelで描画すべきfeatureの一覧になります
// unvisibledFeatures: visibledFeaturesだったfeatureが画面領域外に移動した場合、もしくは描画すべきZoomLevelから外れたfeatureの一覧になります
public render(
  features: Feature[],
  visibledFeatures: Feature[],
  unvisibledFeatures: Feature[]
): void;

// 広告ピンを描画・表示しているレイヤーが非表示にされている場合、これを表示に切り替えます
// 必要でない場合には空のfunctionとして定義してください
public visibleLayer(): void;

// 広告ピンを描画・表示しているレイヤーを非表示にします
// 必要でない場合には空のfunctionとして定義してください
public hideLayer(): void;

// 広告ピンをクリックした場合に、ターゲットとなるアイコンのラベルを強調描画する場合に利用します
// 必要でない場合には空のfunctionとして定義してください
public selectFeature(feature: Feature): void;

// 強調描画されたアイコンのラベルを元に戻します
// 必要でない場合には空のfunctionとして定義してください
public deselectLayer(): void;

// Promoted SDKのreloadメソッドを呼び出した場合に実行されます
// 実行されるとPromoted SDKではfeaturesやtilesetsなどを初期化します
// Promoted SDKのreloadメソッド自体はdeveloper向けに用意されているため、通常では実行されることはありません
public reload(): void;
```

## 実装が必要なEventListenerについて
```
// Map SDKのloadが完了することで発生するイベントです
// PluginやPromoted SDKの各種処理はこれ以降に実行されます
private load(event: mapboxgl.MapboxEvent): void;

// マップの座標をドラッグで移動することで発生するイベントです
// {@required point: Point}
private move(event: mapboxgl.MapMouseEvent): void;

// マップの座標移動が終了することで発生するイベントです
// 座標が移動するごとに新規のTilesetの広告ピンをリクエストします
private moveend(event: any): void;

// 広告ピンをクリックすることで発生するイベントです
// クリックによって広告カードを表示します
private click(event: { features: Feature[] }): void;

// canvas上でポインタを移動することで発生するイベントです
private mousemove(event: { point: Point }): void;
```
