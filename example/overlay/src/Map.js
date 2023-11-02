import React, { useState, useEffect } from 'react';
import DeckGL  from 'deck.gl';
import { LineLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';

import ReactMapGL, { useControl } from 'react-map-gl';

import {
    LightingEffect,
    AmbientLight,
    _SunLight as SunLight
} from "@deck.gl/core";


import { _GeoJSONLoader as GeoJSONLoader } from "@loaders.gl/json";
import zipLoader from './Util/zipLoader'


import { renderLayers } from "./RenderLayers";



const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.5
});

const dirLight = new SunLight({
    timestamp: Date.UTC(2019, 7, 1, 12),
    color: [255, 255, 255],
    intensity: 3.0,
});


// 初期ビューポートの設定
const INITIAL_VIEW_STATE = {
    longitude: 139.74487099091527,
    latitude: 35.653933837879194,
    zoom: 17,
    pitch: 75.88225812885756,
//    zoom: 17,
//    pitch: 0,
    bearing: 10.702702702702704,
};


const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic2hpbWl6dSIsImEiOiJjbGZwbDg3YnUwYWV2M3FubDdvN3pqcDhxIn0.WfKF0oFWPFqS6xn0Mm0Yow"

function Map() {
    const [visible,setVisible] = useState(false)


    const DeckGLOverlay = (props) => {
        const overlay = useControl(() => new MapboxOverlay(props));
        overlay.setProps(props);
        console.log(props)
        return null;
    };


    const [data, setData] = useState(null)
    const [effects] = useState(() => {
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.5];
        return [lightingEffect];
    });



    useEffect(() => {
        const loadData = async (url) => {
            const res = await zipLoader(url, GeoJSONLoader, (d) => {
                //console.log(d)
            })

            console.log(res)
            setData(res)
        }

        loadData("./data/area.zip")

    }, [])

    const handlerCheckBox = (e)=>{
        setVisible(e.target.checked)
    }

    return (
        <div>
            <ReactMapGL 
                initialViewState={INITIAL_VIEW_STATE}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                style={{ width: '100vw', height: '100vh' }}
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                onClick={(v)=>console.log(v)}
            >
                <DeckGLOverlay 
                    effects={effects}
                    layers={renderLayers({ data, visible })} 
                    />
            </ReactMapGL >
            <fieldset>
                <legend>Population Ratio</legend>
                <label><input type="checkbox" value={visible} onClick={handlerCheckBox}></input>OverLaey</label>
            </fieldset>


        </div>
    );
}

export default Map;