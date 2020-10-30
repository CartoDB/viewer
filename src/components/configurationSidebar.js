import React from 'react'
import JSONEditor from '../components/json-editor';


class ConfigurationSidebar extends React.Component {
  state = {
    basemap: "carto",
    showBasemapOptions: true,
    showEditor: true
  }

  changeMap = (e) => {
    this.setState({
      basemap: e.currentTarget.value,
    })
    this.props.onBasemapChange(e.currentTarget.value);
  }

  toggleBasemapOptions = () => {
    this.setState({
      showBasemapOptions: !this.state.showBasemapOptions
    })
  }

  toggleEditor = () => {
    this.setState({
      showEditor: !this.state.showEditor
    })
  }

  render() {
    return  <div className={`configuration-sidebar ${this.props.isOpen? 'is-open':''}`}>
              <div className="configuration-sidebar__title">
                <h2>Configuration</h2>
                <div className="close-button" onClick={this.props.onClose}>
                  <img src="/deck.gl-playground/icons/close.svg" alt="Close"/>
                </div>
              </div>
              <div className={`configuration-sidebar__section ${this.state.showBasemapOptions? 'open':''}`}>
                <div className="section-title" onClick={this.toggleBasemapOptions}>
                  <h3>Basemap</h3>
                </div>
                <div className="section-content">
                  <div className="section-content__group">
                    <input type="radio" id="gmaps" name="basemap" value="gmaps" onChange={this.changeMap} checked={this.state.basemap === 'gmaps'}/>
                    <label htmlFor="gmaps">Google Maps</label>
                  </div>
                  <div className="section-content__group">
                    <input type="radio" id="carto" name="basemap" value="carto" onChange={this.changeMap} checked={this.state.basemap === 'carto'}/>
                    <label htmlFor="carto">CARTO</label>
                  </div>
                  {this.state.basemap === 'carto' &&
                    <div className="section-content__selector">
                      <label htmlFor="basemapStyle">Style</label>
                      <select id="basemapStyle" name="basemapStyle" onChange={this.props.onStyleChange}>
                        <option value="@@#CARTO_BASEMAP.POSITRON">Positron</option>
                        <option value="@@#CARTO_BASEMAP.DARK_MATTER">Dark Matter</option>
                        <option value="@@#CARTO_BASEMAP.VOYAGER">Voyager</option>
                      </select>
                    </div>
                  }
                </div>
              </div>

              <div className={`configuration-sidebar__section configuration-sidebar__section--editor ${this.state.showEditor? 'open':''}`}>
                <div className="section-title" onClick={this.toggleEditor}>
                  <h3>Editor</h3>
                </div>
                <div className="section-content no-side-padding">
                  {this.props.json && <JSONEditor onJsonUpdated={this.props.onJsonUpdated} json={this.props.json}/> }
                </div>
              </div>
            </div>
  }
}

export default ConfigurationSidebar;