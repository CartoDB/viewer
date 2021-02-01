import init from './init';

const element = document.getElementById('root');

// const api_key = 'default_public';
// const setPrivacy = (privacy) => {
//   return new Promise((resolve, reject) => {
//     props.shareOptions.privacy = privacy;
//     setTimeout(() => {
//       resolve(true);
//       // reject();
//     }, 2000);
//   });
// }
// const props = {
//   username: 'alasarr',
//   type: 'bigquery',
//   // query: new URLSearchParams(`?data=cartobq.maps.osm_buildings&api_key=${api_key}`),
//   query: new URLSearchParams('?data=cartodb-on-gcp-pm-team.demo.beijing_data_tileset&color_by_value=aggregated_total&initialViewState={"longitude":116.17963425398031,"latitude":39.84976654170883,"zoom":4}'),
//   shareOptions: {
//     baseUrl: 'https://viewer.carto.com',
//     privacy: 'public',
//     setPrivacy: setPrivacy
//   },
//   goBackFunction: () => {
//     console.log('Navigate back');
//   }
// };

// init(element, props);

init(element);
