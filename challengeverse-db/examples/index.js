'use strict'

const db = require('../')

async function run () {
  const config = {
    database: process.env.DB_NAME || 'challengeverse',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.PORT || '33306',
    dialect: 'mysql'
  }

  const { Restaurant, Order } = await db(config).catch(handleFatalError)


  const demoRestaurant = await Restaurant.createOrUpdate({
    logo: '../logos/pretty_logo.png',
    commercialName: 'Crazy Pizza',
    legalName: 'Crazy Pizza Inc.',
    commercialEmail: 'sales@crazypizza.com',
    adminNumber: 123456,
    address: 'San Francisco, California 94128.',
    location: {
      lat: 37.7696551,
      lng: -122.4713988
    }
  }).catch(handleFatalError)

  let restaurantsReviews = []

  //Add 50 demo reviews
  for (let index = 0; index < 50; index++) {
    restaurantsReviews.push(await Restaurant.addReview(demoRestaurant.id,{
      name: "Santiago Semhan",
      review: `Exellent place to enjoy meals! ${index}`,
      rating: randomIntFromInterval(1,5)
    }))
  }

  let restaurantMeal = await Restaurant.addMeal(demoRestaurant.id, {
    name:"Test Meal",
    description: "Test Meal Description",
    price: 45
   })

   let restaurantMeal2 = await Restaurant.addMeal(demoRestaurant.id, {
    name:"Test Meal 2",
    description: "Test Meal Description",
    price: 90
   })

   let restaurantMeal3 = await Restaurant.addMeal(demoRestaurant.id, {
    name:"Test Meal 3",
    description: "Test Meal Description",
    price: 20
   })

  console.log('--Restaurant--')
  console.log(demoRestaurant)

  console.log('--Restaurant review--')   
  console.log(restaurantsReviews)

  console.log('--Restaurant meal--')   
  console.log(restaurantMeal)

  const restaurants = await Restaurant.findAll().catch(handleFatalError)
  
  console.log('--Restaurants all--')
  console.log(restaurants)
  process.exit(0)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

run()
