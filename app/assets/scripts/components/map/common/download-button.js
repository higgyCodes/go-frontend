'use strict';

import React from 'react';
import html2canvas from 'html2canvas';
import { startDownload } from '../../../utils/download-starter';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

class DownloadButton extends React.Component {
  constructor (props) {
    super(props);
    this.startDownload = this.startDownload.bind(this);
  }

  startDownload () {
    this.props.setZoomToDefault();
    const interval = setInterval(function () {
      clearInterval(interval);
      const timestamp = new Date();
      const map = document.getElementsByClassName('map-vis')[0];
      const downloadButton = document.getElementsByClassName('map-vis__legend--download-btn')[0];
      const dropdowns = Array.from(document.getElementsByClassName('map-vis__legend--top-left'));
      const popover = document.getElementsByClassName('popover__contents')[0];
      const navigation = document.getElementsByClassName('mapboxgl-ctrl-top-right')[0];
      const mapLogoHeader = document.getElementById('map-picture-header');

      const $canvas = document.getElementsByClassName('mapboxgl-canvas')[0];
      const $expimg = document.getElementById('exportimage');
      $expimg.src = $canvas.toDataURL('png');
      $expimg.style.display = 'block';
      document.getElementsByClassName('mapboxgl-map')[0].style.visibility = 'hidden';

      mapLogoHeader.style.visibility = 'visible';
      downloadButton.style.visibility = 'hidden';
      navigation.style.visibility = 'hidden';
      dropdowns.forEach(dropdown => {
        dropdown.style.visibility = 'hidden';
      });

      if (typeof popover !== 'undefined') {
        popover.style.height = 'fit-content';
        popover.style.maxHeight = 'none';
      }

      html2canvas(map, {useCORS: true}).then((renderedCanvas) => {
        startDownload(
          renderedCanvas,
          'map-' + timestamp.getTime() + '.png');

        mapLogoHeader.style.visibility = 'hidden';
        downloadButton.style.visibility = 'visible';
        navigation.style.visibility = 'visible';
        dropdowns.forEach(dropdown => {
          dropdown.style.visibility = 'visible';
        });

        $expimg.style.display = 'none';
        document.getElementsByClassName('mapboxgl-map')[0].style.visibility = 'visible';

        if (typeof popover !== 'undefined') {
          popover.style.height = 'auto';
          popover.style.maxHeight = '225px';
        }
      });
    }, 1000);
  }

  render () {
    return (
      <figcaption
        className='map-vis__legend map-vis__legend--download-btn legend'
        onClick={this.startDownload}>
        <img src='/assets/graphics/content/download.svg' alt='IFRC GO logo'/>
      </figcaption>
    );
  }
}

if (environment !== 'production') {
  DownloadButton.propTypes = {
    data: T.object,
    setZoomToDefault: T.func
  };
}

export default DownloadButton;
