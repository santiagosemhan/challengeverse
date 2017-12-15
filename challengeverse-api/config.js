'use strict'

const debug = require('debug')('platziverse:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'challengeverse',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    dialect: 'mysql',
    logging: s => debug(s)
  },
  googleMaps: {
    API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBwz4e-VhvqGaolpm3iHqSNMMI6lCbAOEM',
    distanceMatrixURI: 'https://maps.googleapis.com/maps/api/distancematrix/json'
  }
}
