import { Tile3DLayer, GeoJsonLayer } from 'deck.gl';
import { _TerrainExtension as TerrainExtension, FillStyleExtension } from '@deck.gl/extensions';
import { Vector3 } from 'math.gl';

//pattern.jsonのkey
const patterns = ['t1', 't2', 't3', 't4'];


//PLATEAU 3D tile置き場。自分でホスティングしているものに変更してください。
const urls = [
  "https://storage.googleapis.com/g3-open-resource/PLATEAU/tokyo/13101_chiyoda-ku_notexture_2/13101_chiyoda-ku_notexture/tileset.json",
  "https://storage.googleapis.com/g3-open-resource/PLATEAU/tokyo/13102_chuo-ku_notexture_2/13102_chuo-ku_notexture/tileset.json",
  "https://storage.googleapis.com/g3-open-resource/PLATEAU/tokyo/13103_minato-ku_notexture_2/13103_minato-ku_notexture/tileset.json"
]

export function renderLayers({ visible }) {
  let layers = []

  //地面に敷く2Dポリゴン
  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: "./data/area.geojson",
    pickable: false,
    stroked: false,
    filled: true,
    getFillColor: [255, 255, 255, 120],
    getLineColor: [0, 0, 0, 255],
    getLineWidth: 1,

    // FillStyleExtensionの設定
    fillPatternMask: false,
    fillPatternAtlas: './img/pattern.png',
    fillPatternMapping: './data/pattern.json',
    getFillPattern: (f, { index }) => {
      return patterns[index % 4]
    },
    getFillPatternScale: 0.1,
    getFillPatternOffset: [0, 0],

    //pattern.jsonで指定したテクスチャを地面のGeoJSONLayerに適応する
    extensions: [new FillStyleExtension({ pattern: true })]
  });

  layers.push(geoJsonLayer);

  //3Dモデルにオーバーレイするレイヤ
  const overLayer = new GeoJsonLayer({
    id: 'over-layer',
    data: "./data/area.geojson",
    pickable: false,
    stroked: false,
    filled: true,
    getFillColor: [255, 255, 255, 120],
    getLineColor: [0, 0, 0, 255],
    getLineWidth: 1,

    // FillStyleExtensionの設定
    fillPatternMask: false,
    fillPatternAtlas: './img/pattern.png',
    fillPatternMapping: './data/pattern.json',
    getFillPattern: (f, { index }) => {
      return patterns[index % 4]
    },
    getFillPatternScale: 0.1,
    getFillPatternOffset: [0, 0],

    // テクスチャを3Dモデルのサーフェイスに適用する
    extensions: [new FillStyleExtension({ pattern: true }), new TerrainExtension()]
  });

  if (visible) layers.push(overLayer);


  //PLATEAU 3D tileを表示ｓ
  urls.forEach((url,i)=>{
    const tile3Dlayer = new Tile3DLayer({
      id: 'tile-3d-layer' + i,
      data: url,
      onTileLoad: (tileHeader) => {
        //浮かないように取り急ぎ建物3Dモデルを40m下げる
        tileHeader.content.cartographicOrigin = new Vector3(
          tileHeader.content.cartographicOrigin.x,
          tileHeader.content.cartographicOrigin.y,
          tileHeader.content.cartographicOrigin.z - 40,
        );
      },
      operation: 'terrain+draw'
    });

    layers.push(tile3Dlayer)

  })
 
  return layers;
}
