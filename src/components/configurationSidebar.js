import {useState, useEffect} from 'react';
import JSONEditor from '../components/json-editor';


function ConfigurationSidebar(props) {
  const [basemap, setBasemap] = useState("carto");
  const [showBasemapOptions, setBasemapOptions] = useState(true);
  const [showEditor, setEditorOptions] = useState(true);
  const [basemapStyle, setBasemapStyle] = useState(undefined);

  useEffect(() => {
    setBasemap(props.json["google"] ? 'gmaps' : 'carto')
  }, [props.json]);

  useEffect(() => {
    for(var i in props.json["views"]) {
      if(props.json["views"][i]["@@type"] === "MapView") {
        setBasemapStyle(props.json["views"][i]["mapStyle"])
        break;
      }
    }
  }, [props.json]);

  const changeMap = (e) => {
    props.onBasemapChange(e.currentTarget.value);
  }

  const toggleBasemapOptions = () => {
    setBasemapOptions(!showBasemapOptions)
  }

  const toggleEditor = () => {
    setEditorOptions(!showEditor);
  }

  const onStyleChange = (e) => {
    setBasemapStyle(e.target.value);
    props.onStyleChange(e);
  }

  return  <div className="configuration-sidebar">
            <div className="configuration-sidebar__title">
              <h2>Configuration</h2>
              <div className="close-button" onClick={props.onClose}>
                <img src="/icons/close.svg" alt="Close"/>
              </div>
            </div>
            <div className={`configuration-sidebar__section ${showBasemapOptions? 'open':''}`}>
              <div className="section-title" onClick={toggleBasemapOptions}>
                <h3>Basemap</h3>
              </div>
              <div className="section-content">
                <div className="section-content__group">
                  <input type="radio" id="gmaps" name="basemap" value="gmaps" onChange={changeMap} checked={basemap === 'gmaps'}/>
                  <label htmlFor="gmaps">Google Maps</label>
                </div>
                <div className="section-content__group">
                  <input type="radio" id="carto" name="basemap" value="carto" onChange={changeMap} checked={basemap === 'carto'}/>
                  <label htmlFor="carto">CARTO</label>
                </div>
                {basemap === 'carto' &&
                  <div className="section-content__selector">
                    <label htmlFor="basemapStyle">Style</label>
                    <select id="basemapStyle" name="basemapStyle" value={basemapStyle} onChange={onStyleChange}>
                      <option value="@@#CARTO_BASEMAP.POSITRON">Positron</option>
                      <option value="@@#CARTO_BASEMAP.DARK_MATTER">Dark Matter</option>
                      <option value="@@#CARTO_BASEMAP.VOYAGER">Voyager</option>
                    </select>
                  </div>
                }
              </div>
            </div>

            <div className={`configuration-sidebar__section configuration-sidebar__section--editor ${showEditor? 'open':''}`}>
              <div className="section-title" onClick={toggleEditor}>
                <h3>Editor</h3>
              </div>
              <div className="section-content no-side-padding">
                {props.json && <JSONEditor onJsonUpdated={props.onJsonUpdated} json={props.json}/> }
              </div>
            </div>
          </div>
}

export default ConfigurationSidebar;