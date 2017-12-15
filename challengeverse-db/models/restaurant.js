'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

/**
 * Setup Restaurant Model
 *
 * Restaurant Sequealize Model definition
 *
 * @param {} config
 */
module.exports = function setupRestaurantModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('restaurant', {
    logo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    commercialName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    legalName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rating: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    commercialEmail: {
      type: Sequelize.STRING,
      allowNull: false
    },
    adminNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location: {
      type: Sequelize.JSON,
      allowNull: false
    }
  })
}
