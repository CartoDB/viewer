import { numberFormatter } from './formatter';

export default function htmlForFeature(feature) {
  let html = '';
  Object.keys(feature.properties).forEach((propertyName) => {
    if (propertyName === 'layerName') return;

    html = html.concat(
      `<strong>${propertyName.toUpperCase()}</strong>: ${numberFormatter(
        feature.properties[propertyName]
      )}<br/>`
    );
  });
  return html;
}
