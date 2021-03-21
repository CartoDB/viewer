# CARTO viewer

CARTO viewer

https://viewer.carto.com/:provider/:type?source=&connection=&access_token

## Parameters

Path parameters:

- **username**: (mandatory) CARTO username.

- **provider**: (mandatory) connection to use. Posible values are `bigquery`, `redshift`, `snowflake` or `postgresql`

- **type**: (mandatory) type of the map to visualize. Posible values are `tileset`, `table` or `sql`.

Query parameters:

- **source**: (mandatory) data we want to apply. Tileset name if type is tileset, table name if type is table or sql query if type is sql.

- **connection**: (connection) connection name to use.

- **access_token**: (mandatory) token to use.

- **color_by_value**: (optional) create a default ramp on the selected attribute. Example: `color_by_value=aggregated_total`

### URL examples

**BigQuery tileset**:

````url
https://cartodb-on-gcp-frontend-team.web.app/bigquery/tileset?source=cartodb-gcp-backend-data-team.alasarr.usa_blockgroup_tileset&connection=dev-bigquery&access_token=XXX

**BigQuery table**:

```url
https://cartodb-on-gcp-frontend-team.web.app/bigquery/table?source=cartodb-gcp-backend-data-team.alasarr.airports&connection=dev-bigquery&access_token=XXX
````

**BigQuery SQL**:

```url
https://cartodb-on-gcp-frontend-team.web.app/bigquery/sql?source=select * from cartodb-gcp-backend-data-team.alasarr.airports&connection=dev-bigquery&access_token=XXX
```

**Snowflake table**:

````url

https://cartodb-on-gcp-frontend-team.web.app/snowflake/table?source=alasarr.airports&connection=dev-snowflake&access_token=XXX

**Snowflake query**:

```url
https://cartodb-on-gcp-frontend-team.web.app/snowflake/sql?source=select * from alasarr.airports limit 10&connection=dev-snowflake&access_token=XXX
````

**Redshift table**:

```url
https://cartodb-on-gcp-frontend-team.web.app/redshift/table?source=airports&connection=dev-redshift&access_token=XXX
```

**Redshift query**:

```url
https://cartodb-on-gcp-frontend-team.web.app/redshift/sql?source=select* from airports&connection=dev-redshift&access_token=XXX
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
