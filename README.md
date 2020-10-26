# CARTO Deck.gl playground

Deck.gl playground viewer.

https://cartodb.github.io/deck.gl-playground/

## URL parameters

* **type**: (optional) type of the map to visualize. Posible values are `tileset` and `sql`. Default to `sql`

* **source**: (optional) source for the type. Posible values are `bigquery` or `postgres`. Default to `postgres`

* **data**: (optional) data we want to apply. Default to `SELECT the_geom_webmercator FROM populated_places` if *type = sql*.  Or `cartobq.maps.osm_buildings` if if *type = tileset*.

* **username**: (optional) CARTO username. Default to `public`

* **apiKey**: (optional) CARTO API KEY. Default to `default_public`

### URL examples

**SQL**:

```url
https://cartodb.github.io/deck.gl-playground?type=sql&data=SELECT the_geom_webmercator,1 FROM populated_places
```

**BigQuery tiler**

```url
https://cartodb.github.io/deck.gl-playground/?type=tileset&data=cartobq.maps.osm_buildings&source=bigquery
```

**Credentials**

```url
https://cartodb.github.io/deck.gl-playground?type=sql&username=alasarr&apiKey=4tGaTWC1TVzv9EfYCyDfYg&data=SELECT the_geom_webmercator FROM tesla_geocoded
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

Deploy the code in GitHub pages at the URL: https://cartodb.github.io/deck.gl-playground/

