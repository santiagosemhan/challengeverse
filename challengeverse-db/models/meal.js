'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

/**
 * Setup Meal Model
 *
 * Meal Sequealize Model definition
 *
 * @param {} config
 */
module.exports = function setupMealModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('meal', {
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
