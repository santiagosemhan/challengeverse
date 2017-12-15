'use strict'

const Sequelize = require('sequelize')

const Op = Sequelize.Op;

/**
 * Custom Aliases used in this module
 * 
 */
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt
}

/**
 *  Instantiates RestaurantService, its provides functions for manage all restaurants related actions.
 * 
 * 
 * @param {Model} RestaurantModel 
 * @param {Model} ReviewModel 
 * @param {Model} mealObj 
 */
module.exports = function setupRestaurant (RestaurantModel, ReviewModel, MealModel) {

  async function createOrUpdate (restaurant) {
    const cond = {
      where: {
        legalName: restaurant.legalName
      }
    }

    const existingRestaurant = await RestaurantModel.findOne(cond)

    if (existingRestaurant) {
      const updated = await RestaurantModel.update(restaurant, cond)
      return updated ? RestaurantModel.findOne(cond) : existingRestaurant
    }

    const result = await RestaurantModel.create(restaurant)
    return result.toJSON()
  }

  async function findById (id) {
    return await RestaurantModel.findById(id,{
      include:[{ all: true }],
      raw: false
    })
  }

  async function findAll (filter = {}) {

    let options = Object.assign(filter,{
      include:[{ all: true }],
      raw:false
    })

    return await RestaurantModel.findAll(options)
  }

  /**
   * Remove Restaurant instance
   * 
   * @param {Int} id - The Id of restaurant to delete
   */
  async function remove(id){
    let restaurant = await this.findById(id)

    if(! restaurant){
      throw new Error(`Restaurant instance with id: ${id} not Found`)
    }

    let result =  await RestaurantModel.destroy({
      where: { id }
    })

    return result
  }

  /**
   * Add Review to an existing restaurant
   * Average is calculated and saved to restaurant rating property.
   * 
   * @param {*} id Restaurant id
   * @param {*} reviewObj Review to save and relate with restaurant
   */
  async function addReview(id, reviewObj){
    let restaurant = await this.findById(id)
    
    if(! restaurant){
      throw new Error(`Restaurant instance with id: ${id} not Found`)
    }

    const review = await ReviewModel.create(reviewObj)
    
    let result =  await restaurant.addReview(review)

    let totalRating = 0

    let ratingSum = 0 
    
    let totalReviews = restaurant.reviews.length

    //has previous reviews 
    if(totalReviews){
      for (const key in restaurant.reviews) {
          ratingSum += restaurant.reviews[key].rating
      }

      // here you can round the avg in decimals you want 
      totalRating = (ratingSum + review.rating) / (totalReviews + 1)

    }else{
      totalRating = review.rating
    }

    let updated = await RestaurantModel.update({rating: totalRating},{ where:{id}})

    return this.findById(id)

  }

  /**
   * Add Meal to an existing restaurant
   * 
   * @param {*} id Restaurant id
   * @param {*} mealObj  Meal to save and relate with restaurant
   */
  async function addMeal(id,mealObj){
      let restaurant = await this.findById(id)
      
      if(! restaurant){
        throw new Error(`Restaurant instance with id: ${id} not Found`)
      }

      const meal = await MealModel.create(mealObj)
      
      let result =  await restaurant.addMeal(meal)

      return this.findById(id)      
  }


  return {
    createOrUpdate,
    findById,
    findAll,
    remove,
    addReview,
    addMeal
  }
}
