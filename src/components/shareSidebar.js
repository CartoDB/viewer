import React from 'react'


class ShareSidebar extends React.Component {
  urlShareRef = React.createRef();
  embedCodeRef = React.createRef();

  state = {
    showEmbed: true,
    showUrl: true
  }

  toggleEmbed = () => {
    this.setState({
      showEmbed: !this.state.showEmbed
    })
  }

  toggleUrl = () => {
    this.setState({
      showUrl: !this.state.showUrl
    })
  }

  shareUrl = (json) => {
    const {origin, pathname} = window.location;
    const config = encodeURIComponent(JSON.stringify(json, null, 2));
    const url = `${origin + pathname}?config=${config}`;
    return url;
  }

  iframeCode = (json) => {
    var url = this.shareUrl(json);
    var iframeUrl = `<iframe src="${url}&embed=true" title="Deck.gl Playground"/>`;
    return iframeUrl;
  }

  copyTextarea = (e, reference) => {
    reference.current.select();
    document.execCommand('copy');
    e.target.focus();
  };

  render() {
    return  <div className={`configuration-sidebar ${this.props.isOpen? 'is-open':''}`}>
              <div className="configuration-sidebar__title">
                <h2>Share</h2>
                <div className="close-button" onClick={this.props.onClose}>
                  <img src="/deck.gl-playground/icons/close.svg" alt="Close"/>
                </div>
              </div>
              <div className={`configuration-sidebar__section ${this.state.showUrl? 'open':''}`}>
                <div className="section-title" onClick={this.toggleUrl}>
                  <h3>URL</h3>
                </div>
                <div className="section-content">
                  <textarea ref={this.urlShareRef} readOnly value={this.shareUrl(this.props.json)}></textarea>
                  <div className="button-container">
                    <button className="button" onClick={(e) => this.copyTextarea(e, this.urlShareRef)}>Copy URL</button>
                  </div>
                </div>
              </div>

              <div className={`configuration-sidebar__section ${this.state.showEmbed? 'open':''}`}>
                <div className="section-title" onClick={this.toggleEmbed}>
                  <h3>Embed map</h3>
                </div>
                <div className="section-content">
                  <textarea ref={this.embedCodeRef} readOnly value={this.iframeCode(this.props.json)}></textarea>
                  <div className="button-container">
                    <button className="button" onClick={(e) => this.copyTextarea(e, this.embedCodeRef)}>Copy Code</button>
                  </div>
                </div>
              </div>
            </div>
  }
}

export default ShareSidebar;