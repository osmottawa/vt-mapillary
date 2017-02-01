#!/usr/bin/env node
const VectorTile = require('vector-tile').VectorTile
const Protobuf = require('pbf')
const axios = require('axios')
const turf = require('@turf/turf')
const range = require('lodash.range')
const meow = require('meow')

const cli = meow(`
    Usage
      $ mapillary <input (z/x/y)>

    Examples
      $ mapillary 14/4746/5867
      <GeoJSON FeatureCollection>
`)

const [z, x, y] = cli.input[0].split('/')
const url = `https://d25uarhxywzl1j.cloudfront.net/v0.1/${z}/${x}/${y}.mvt`
const collection = turf.featureCollection([])

axios.get(url, {responseType: 'arraybuffer'}).then(r => {
  const tile = new VectorTile(new Protobuf(r.data))
  const sequence = tile.layers['mapillary-sequences']
  const images = tile.layers['mapillary-images']

  // Store sequences
  range(sequence.length).map(i => {
    const feature = sequence.feature(i).toGeoJSON(x, y, z)
    collection.features.push(feature)
  })
  // Store images
  if (images) {
    range(images.length).map(i => {
      const feature = images.feature(i).toGeoJSON(x, y, z)
      collection.features.push(feature)
    })
  }
  process.stdout.write(JSON.stringify(collection, null, 2))
})
