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
 *  Instantiates OrderService, its provides functions for manage all orders related actions.
 * 
 * 
 * @param {Model} OrderModel 
 * @param {Model} ReviewModel 
 * @param {Model} mealObj 
 */
module.exports = function setupOrder (OrderModel, MealModel) {

  async function create (orderObj) {

    let order = await OrderModel.create(orderObj)
    
    let promises = []
    
    //assume that request comes with an array of valid meals ids and set it's into database
    //TODO: valid that all meals to be present in database, otherwhise this will throw an error in the api response
    let result = await order.setMeals(orderObj.meals)

    return this.findById(order.id)
  }

  async function findById (id) {
    return await OrderModel.findById(id,{
      include:[{ all: true }],
      raw: false
    })
  }

  async function findAll (filter = {}) {

    let options = Object.assign(filter,{
      include:[{ all: true }],
      raw:false
    })

    return await OrderModel.findAll(options)
  }

  /**
   * Remove Order instance
   * 
   * @param {Int} id - The Id of order to delete
   */
  async function remove(id){
    let order = await this.findById(id)

    if(! order){
      throw new Error(`order instance with id: ${id} not Found`)
    }

    let result =  await OrderModel.destroy({
      where: { id }
    })

    return result
  }


  return {
    create,
    findById,
    findAll,
    remove
  }
}
