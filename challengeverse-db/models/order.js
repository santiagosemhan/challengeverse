'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

/**
 * Setup Order Model
 *
 * Order Sequealize Model definition
 *
 * @param {} config
 */
module.exports = function setupOrderModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('order', {
    totalCost: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    latLng: {
      type: Sequelize.JSON,
      allowNull: false
    }
  })
}
