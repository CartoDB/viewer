# CARTO viewer

CARTO viewer

https://viewer.carto.com/user/:username/:connection/:type?source=...

## Parameters

Path parameters:

- **username**: (mandatory) CARTO username.

- **connection**: (mandatory) connection to use. Posible values are `bigquery`, `redshift` or `snowflake`.

- **type**: (mandatory) type of the map to visualize. Posible values are `tileset`, `table` or `sql`.

Query parameters:

- **source**: (mandatory) data we want to apply. Tileset name if type is tileset, table name if type is table or sql query if type is sql.

- **access_token**: (optional) token to use.

- **api_key**: (optional) CARTO API KEY to guarantee backwards compatibility. Default to `default_public`.

- **color_by_value**: (optional) create a default ramp on the selected attribute. Example: `color_by_value=aggregated_total`

### URL examples

**BigQuery tileset**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/bigquery/tileset?source=cartodb-gcp-backend-data-team.alasarr.usa_county_2015_tileset&api_key=XXX
```

**BigQuery table**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/bigquery/table?source=cartodb-gcp-backend-data-team.alasarr.airports&api_key=XXX
```

**BigQuery SQL**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/bigquery/sql?source=select * from cartodb-gcp-backend-data-team.alasarr.airports&api_key=XXX
```

**CARTO table**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/carto/table?source=airports&api_key=caa6158db8ba3550a16ea2b3505da92374ec92ec
```

**CARTO SQL**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/carto/sql?source=select * from airports&api_key=caa6158db8ba3550a16ea2b3505da92374ec92ec
```

**Snowflake table**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/snowflake/table?source=alasarr.airports&access_token=XXX
```

**Snowflake query**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/snowflake/sql?source=select * from alasarr.airports limit 10&access_token=XXX
```

**Redshift table**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/redshift/table?source=airports&access_token=XXX
```

**Redshift query**:

```url
https://cartodb-on-gcp-frontend-team.web.app/user/carto/redshift/sql?source=select* from airports&access_token=XXX
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

To style using a color ramp you can use [CARTO helper functions](https://github.com/visgl/deck.gl/blob/master/docs/api-reference/carto/styles.md):

```js
"getFillColor":  {
  "@@function": "colorBins",
  "attr": colorByValue,
  "domain": [
    10,
    100,
    1000,
    10000,
    100000,
    1000000
  ],
  "colors": "Temps"
}
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn deploy`

Deploy the code in firebase at the URL: https://viewer.carto.com/
