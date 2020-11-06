# CARTO Deck.gl playground

Deck.gl playground viewer.

https://viewer.carto.com/user/:username/:type?data=...

## Pparameters

Path parameters:

* **type**: (mandatory) type of the map to visualize. Posible values are `bigquery` and `sql`.

* **username**: (mandatory) CARTO username.

Query parameters:

* **data**: (mandatory) data we want to apply.

* **api_key**: (optional) CARTO API KEY. Default to `default_public`

* **color_by_value**: (optional) create a default ramp on the selected attribute. Example: `color_by_value=aggregated_total`

### URL examples

**SQL**:

```url
https://viewer.carto.com/user/alasarr/sql?api_key=4tGaTWC1TVzv9EfYCyDfYg&data=SELECT%20the_geom_webmercator%20FROM%20tesla_geocoded
```

**BigQuery tiler**

```url
https://viewer.carto.com/user/alasarr/bigquery?data=cartobq.maps.osm_buildings&color_by_value=aggregated_total
```

## Basemaps

To set google basemaps, set at the editor:

```js
"google": true
```

To set VOYAGER, POSITRON or DARK_MATTER, set at the editor:

```js
"views": [
  {
    "@@type": "MapView",
    "controller": true,
    "mapStyle": "@@#CARTO_BASEMAP.POSITRON"
  }
]
```

## Styling

To style using a color ramp you can use inline declarations:

```js
"getFillColor": "@@= properties.cartodb_id % 2  ? [255,0,0] : [0, 255, 0]",
```



## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn deploy`

Deploy the code in GitHub pages at the URL: https://viewer.carto.com/

