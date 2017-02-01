# vt-mapillary

> Converts Mapillary Vector Tile to GeoJSON

## Install

```bash
$ npm install --global vt-mapillary
```

## Usage

Mapillary only supports zoom levels 6 to 14.

Zoom 14 contains all images as points.

```bash
$ vt-mapillary 14/4745/5867 > results.geojson
```
