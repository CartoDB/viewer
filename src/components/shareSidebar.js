import {useState, useRef} from 'react';

function ShareSidebar(props) {
  const [showEmbed, setShowEmbed] = useState(true);
  const [showUrl, setShowUrl] = useState(true);

  const urlShareRef = useRef();
  const embedCodeRef = useRef();

  const toggleEmbed = () => {
    setShowEmbed(!showEmbed);
  }

  const toggleUrl = () => {
    setShowUrl(!showUrl);
  }

  const shareUrl = (json, viewState) => {
    const {origin, pathname} = window.location;

    if(viewState)
      json.initialViewState = {...viewState};
    
    const config = encodeURIComponent(btoa(JSON.stringify(json, null, 2)));
    return `${origin + pathname}?config=${config}`;
  }

  const iframeCode = (json, viewState) => {
    var url = shareUrl(json, viewState);
    var iframeUrl = `<iframe src="${url}&embed=true" title="Deck.gl Playground"/>`;
    return iframeUrl;
  }

  const copyTextarea = (e, reference) => {
    reference.current.select();
    document.execCommand('copy');
    e.target.focus();
  };

  return  <div className="configuration-sidebar">
            <div className="configuration-sidebar__title">
              <h2>Share</h2>
              <div className="close-button" onClick={props.onClose}>
                <img src="/icons/close.svg" alt="Close"/>
              </div>
            </div>
            <div className={`configuration-sidebar__section ${showUrl? 'open':''}`}>
              <div className="section-title" onClick={toggleUrl}>
                <h3>URL</h3>
              </div>
              <div className="section-content">
                <textarea ref={urlShareRef} readOnly value={shareUrl(props.json, props.viewState)}></textarea>
                <div className="button-container">
                  <button className="button" onClick={(e) => copyTextarea(e, urlShareRef)}>Copy URL</button>
                </div>
              </div>
            </div>

            <div className={`configuration-sidebar__section ${showEmbed? 'open':''}`}>
              <div className="section-title" onClick={toggleEmbed}>
                <h3>Embed map</h3>
              </div>
              <div className="section-content">
                <textarea ref={embedCodeRef} readOnly value={iframeCode(props.json, props.viewState)}></textarea>
                <div className="button-container">
                  <button className="button" onClick={(e) => copyTextarea(e, embedCodeRef)}>Copy Code</button>
                </div>
              </div>
            </div>
          </div>
}

export default ShareSidebar;