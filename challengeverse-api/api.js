'use strict'

const debug = require('debug')('challengeverse:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
const request = require('request-promise-native')
const db = require('challengeverse-db')

const config = require('./config')

const api = asyncify(express.Router())

let services, Restaurant, Order

api.use(express.json())

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }

    Restaurant = services.Restaurant
    Order = services.Order
  }
  next()
})

/**
 *
 * Restaurants Endpoints
 *
 * TODO: provide separate files to each root endpoints.
 * Example:
 * /endpoints
 *   |_ restaurants.js
 *   |_ orders.js
 *
 */

api.get('/restaurants', async (req, res, next) => {
  debug('A request has come to /restaurants')

  let restaurants = []

  let filter

  // Here is mandatory validate query string parameter for security reasons
  let rating = req.query.rating

  if (rating) {
    filter = {
      where: {
        rating: JSON.parse(rating)
      }
    }
  }

  try {
    restaurants = await Restaurant.findAll(filter)
  } catch (e) {
    return next(e)
  }

  res.send(restaurants)
})

/**
 * Get a Restaurant
 */
api.get('/restaurants/:id', async (req, res, next) => {
  let id = req.params.id

  debug(`A get request has come to /restaurants/${id}`)

  let result
  
  try {
    result = await Restaurant.findById(id)
  } catch (e) {
    return next(e)
  }

  if(!result){
    return res.status(404).send({error: `Restaurant with id: ${id} not found`})
  }

  res.send(result)

})

/**
 * Create a new Restaurant
 */
api.post('/restaurants', async (req, res, next) => {

  let restaurant = req.body

  debug(`A put request has come to /restaurants`)

  let result

  try {
    result = await Restaurant.createOrUpdate(restaurant)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

/**
 * Delete a Restaurant
 */
api.delete('/restaurants/:id', async (req, res, next) => {
  let id = req.params.id

  debug(`A delete request has come to /restaurants/${id}`)

  let result

  try {
    result = await Restaurant.remove(id)
  } catch (e) {
    return next(e)
  }

  if(!result){
    return res.status(404).send({error: `Restaurant with id: ${id} not found`})
  }

  // Successfull empty response =)
  res.status(204).send({})
})

/**
 * Update a Restaurant
 */
api.put('/restaurants/:id', async (req, res, next) => {
  let id = req.params.id

  let restaurant = Object.assign({ id }, req.body)

  debug(`A put request has come to /restaurants/${id}`)

  if(!Restaurant.findById(id)){
    return res.status(404).send({error: `Restaurant with id: ${id} not found`})
  }

  let result

  try {
    result = await Restaurant.createOrUpdate(restaurant)
  } catch (e) {
    return next(e)
  }

  res.send(restaurant)
})

/**
 * Creates a review, relates to a Restaurant and calculate totalRating. 
 * 
 */
api.post('/restaurants/:id/reviews', async (req, res, next) => {
  let id = req.params.id

  const review = req.body

  let result

  debug(`A post request has come to /restaurants/${id}/reviews`)

  try {
    result = await Restaurant.addReview(id, review)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})


/**
 * Creates a Meal and relates to a restaurant
 * 
 */
api.post('/restaurants/:id/meals', async (req, res, next) => {
  let id = req.params.id

  const meal = req.body

  let result

  debug(`A post request has come to /restaurants/${id}/meal`)

  try {
    result = await Restaurant.addMeal(id, meal)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

/**
 * Creates a new order. Estimates ETA by querying google maps api traffic model. 
 * 
 */
api.post('/restaurants/:id/order', async (req, res, next) => {
  let id = req.params.id

  const orderObj = req.body

  debug(`A post request has come to /restaurants/${id}/order`)

  let result

  try {
    let restaurant = await Restaurant.findById(id)

    if (!restaurant) {
      throw new Error(`Restaurant instance with id: ${id} not Found`)
    }

    let order = await Order.create(orderObj)

    let orderLocation = `${order.latLng.lat},${order.latLng.lng}`

    let restaurantLocation = `${restaurant.location.lat},${restaurant.location.lng}`

    let options = {
      uri: config.googleMaps.distanceMatrixURI,
      qs: {
        origins: restaurantLocation,
        destinations: orderLocation,
        mode: 'driving',
        departure_time: 'now',
        traffic_model: 'best_guess',
        key: config.googleMaps.API_KEY
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }

    let req = await request(options)

    let eta = { status: 'cannot determine ETA'}

    if (req.rows.length) {
      eta = req.rows[0].elements[0]
    }

    result = Object.assign(order.toJSON(), {eta})
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

module.exports = api
