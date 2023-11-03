import { Tile3DLayer, GeoJsonLayer } from 'deck.gl';
import { _TerrainExtension as TerrainExtension, FillStyleExtension } from '@deck.gl/extensions';
import { Vector3 } from 'math.gl';

import { nest as d3nest } from 'd3-collection'
import { color as d3color } from 'd3-color'
import { zoning } from './zoningConf';
const zoningColor = d3nest()
  .rollup(d => d[0])
  .key(d => d.id)
  .map(zoning)


//PLATEAUの 3D tileのURL
const urls = [
  "https://storage.googleapis.com/g3-open-resource/PLATEAU/tokyo/13101_chiyoda-ku_notexture_2/13101_chiyoda-ku_notexture/tileset.json",
  "https://storage.googleapis.com/g3-open-resource/PLATEAU/tokyo/13102_chuo-ku_notexture_2/13102_chuo-ku_notexture/tileset.json",
  "https://storage.googleapis.com/g3-open-resource/PLATEAU/tokyo/13103_minato-ku_notexture_2/13103_minato-ku_notexture/tileset.json"
]


export function renderLayers({ visible }) {
  let layers = []

  //用途地域の塗り分けポリゴン
  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: "./data/area.geojson",
    pickable: false,
    stroked: false,
    filled: true,
    getFillColor: d => {
      const c = d3color(zoningColor.get(d.properties.A29_004).color);
      return [c.r, c.g, c.b, 110]
    },
    getLineColor: [0, 0, 0, 255],
    getLineWidth: 1,
  });

  layers.push(geoJsonLayer);

  //エクステンションで3Dタイルに適用するGeoJSON
  const overLayer = new GeoJsonLayer({
    id: 'over-layer',
    data: "./data/area.geojson",
    pickable: false,
    stroked: false,
    filled: true,
    getFillColor: d => {
      const c = d3color(zoningColor.get(d.properties.A29_004).color);
      return [c.r, c.g, c.b, 110]
    },
    getLineColor: [0, 0, 0, 255],
    getLineWidth: 1,
    //エクステンションを適用
    extensions: [new TerrainExtension()]
  });

  if (visible) layers.push(overLayer);



  //PLATEAUの3D tileを描画
  urls.forEach((url,i)=>{
    const tile3Dlayer = new Tile3DLayer({
      id: 'tile-3d-layer' + i,
      data: url,
      onTileLoad: (tileHeader) => {
        tileHeader.content.cartographicOrigin = new Vector3(
          tileHeader.content.cartographicOrigin.x,
          tileHeader.content.cartographicOrigin.y,
          tileHeader.content.cartographicOrigin.z - 40,
        );
      },
      //TerrainExtensionの適用対象に指定
      operation: 'terrain+draw'
    });

    layers.push(tile3Dlayer)

  })
 
  //レイヤーの重なり順を配列で指定(先頭のレイヤーが一番下になる)
  return layers;
}
