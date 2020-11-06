import {useState} from 'react';
import ConfigurationSidebar from '../components/configurationSidebar';
import ShareSidebar from '../components/shareSidebar';

function Sidebar(props) {
  const [configurationSidebarOpen, setConfigurationSidebarOpen] = useState(false);
  const [shareSidebarOpen, setShareSidebarOpen] = useState(false);

  const closeConfigurationSidebar = () => {
    props.onMenuCloses();
    setConfigurationSidebarOpen(false);
  }

  const openConfigurationSidebar = () => {
    closeShareSidebar();
    setConfigurationSidebarOpen(true);
  }

  const closeShareSidebar = () => {
    props.onMenuCloses();
    setShareSidebarOpen(false);
  }

  const openShareSidebar = () => {
    closeConfigurationSidebar();
    setShareSidebarOpen(true);
  }

  return  <div className="sidebar-container">
            <div className="sidebar">
              <div className="sidebar__element sidebar__element--logo">
                <img src="/icons/carto-logo.svg" alt="CARTO"/>
              </div>
              <div className={`sidebar__element ${configurationSidebarOpen? 'is-selected':''}`} onClick={openConfigurationSidebar}>
                <img src="/icons/settings.svg" alt="Settings"/>
              </div>
              <div className={`sidebar__element ${shareSidebarOpen? 'is-selected':''}`} onClick={openShareSidebar}>
                <img src="/icons/share.svg" alt="Share map"/>
              </div>
            </div>
            {configurationSidebarOpen &&
              <ConfigurationSidebar
                  onBasemapChange={props.onBasemapChange}
                  onStyleChange={props.onStyleChange}
                  json={props.json}
                  onJsonUpdated={props.onJsonUpdated}
                  onClose={closeConfigurationSidebar}/>}
            {shareSidebarOpen &&
              <ShareSidebar
                json={props.jsonMap}
                viewState={props.viewState}
                onClose={closeShareSidebar}
                />}
          </div>
}

export default Sidebar;