import React, {Component} from 'react';
import DeckGL from '@deck.gl/react';
import {View} from '@deck.gl/core';

export default class DeckWithMapboxMaps extends Component {
  render() {
    const {views = []} = this.props;

    const maps = [];
    for (const view of views) {
      if (view.props.map || view.props.mapStyle) {
        maps.push(
          <View id={view.props.id} key={view.props.id}>
            <this.props.Map
              reuseMap
              mapStyle={view.props.mapStyle}
            />
          </View>
        );
      }
    }
    return (
      <div className="deck-gl-map-container">
        <DeckGL id="json-deck" {...this.props}>
          {maps}
        </DeckGL>
        <div className="zoom-control">
          <div className="zoom-option" data-type="zoom-in" onClick={this.props.onZoom}>
            <img src="/deck.gl-playground/icons/zoom-in.svg" alt="Zoom In"/>
          </div>
          <div className="zoom-option" data-type="zoom-out" onClick={this.props.onZoom}>
            <img src="/deck.gl-playground/icons/zoom-out.svg" alt="Zoom Out"/>
          </div>
        </div>
      </div>
    );
  }
}