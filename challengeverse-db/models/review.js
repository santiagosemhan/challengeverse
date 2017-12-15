'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

/**
 * Setup Review Model
 *
 * Review Sequealize Model definition
 *
 * @param {} config
 */
module.exports = function setupReviewModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('review', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    review: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
}
