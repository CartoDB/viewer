import React from 'react'
import ConfigurationSidebar from '../components/configurationSidebar';
import ShareSidebar from '../components/shareSidebar';

class Sidebar extends React.Component {
  state = {
    configurationSidebarOpen: true,
    shareSidebarOpen: false,
  }

  closeConfigurationSidebar = () => {
    this.setState({
      configurationSidebarOpen: false,
    })
  }

  openConfigurationSidebar = () => {
    this.closeShareSidebar();
    this.setState({
      configurationSidebarOpen: true,
    })
  }

  closeShareSidebar = () => {
    this.setState({
      shareSidebarOpen: false,
    })
  }

  openShareSidebar = () => {
    this.closeConfigurationSidebar();
    this.setState({
      shareSidebarOpen: true,
    })
  }

  render() {
    return  <div className="flex">
              <div className="sidebar">
                <div className="sidebar__element sidebar__element--logo">
                  <img src="/deck.gl-playground/icons/carto-logo.svg" alt="CARTO"/>
                </div>
                <div className={`sidebar__element ${this.state.configurationSidebarOpen? 'is-selected':''}`} onClick={this.openConfigurationSidebar}>
                  <img src="/deck.gl-playground/icons/settings.svg" alt="Settings"/>
                </div>
                <div className={`sidebar__element ${this.state.shareSidebarOpen? 'is-selected':''}`} onClick={this.openShareSidebar}>
                  <img src="/deck.gl-playground/icons/share.svg" alt="Share map"/>
                </div>
              </div>
              <ConfigurationSidebar
                  isOpen={this.state.configurationSidebarOpen}
                  onBasemapChange={this.props.onBasemapChange}
                  onStyleChange={this.props.onStyleChange}
                  json={this.props.json}
                  onJsonUpdated={this.props.onJsonUpdated}
                  onClose={this.closeConfigurationSidebar}/>

              <ShareSidebar
                isOpen={this.state.shareSidebarOpen}
                json={this.props.json}
                onClose={this.closeShareSidebar}
                />
            </div>
  }
}

export default Sidebar;