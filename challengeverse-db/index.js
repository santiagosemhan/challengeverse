'use strict'

const setupDatabase = require('./lib/db')
const setupMealModel = require('./models/meal')
const setupOrderModel = require('./models/order')
const setupRestaurantModel = require('./models/restaurant')
const setupReviewModel = require('./models/review')
const setupRestaurant = require('./lib/restaurant')
const setupOrder = require('./lib/order')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    },
    define: {
      timestamps: true
    }
  })

  const sequelize = setupDatabase(config)
  const RestaurantModel = setupRestaurantModel(config)
  const OrderModel = setupOrderModel(config)
  const ReviewModel = setupReviewModel(config)
  const MealModel = setupMealModel(config)

  RestaurantModel.hasMany(ReviewModel,{as:'reviews'})
  ReviewModel.belongsTo(RestaurantModel)

  RestaurantModel.hasMany(MealModel)
  MealModel.belongsTo(RestaurantModel)

  MealModel.belongsToMany(OrderModel, {through: 'MealOrder'});
  OrderModel.belongsToMany(MealModel, {through: 'MealOrder'});

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Restaurant = setupRestaurant(RestaurantModel, ReviewModel, MealModel)

  const Order = setupOrder(OrderModel,MealModel)

  return {
    Restaurant,
    Order
  }
}
