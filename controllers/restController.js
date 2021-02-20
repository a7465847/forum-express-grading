const db = require('../models')
const { Restaurant, Category, Comment, User } = db
const pageLimit = 10
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((_, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikeUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      const userId = helpers.getUser(req).id
      restaurant.increment('viewCounts')
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(userId)
      const isLike = restaurant.LikeUsers.map(d => d.id).includes(userId)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLike
      })
    })
  },
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    })
  },
  getTopRestaurants: async (req, res) => {
    const searchFavoritedRestaurants = helpers.getUser(req).FavoritedRestaurants
    return await Restaurant.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Favorites WHERE Favorites.RestaurantId = Restaurant.id)'), 'FavoritedCount']
        ]
      },
      order: [
        [sequelize.literal('FavoritedCount'), 'DESC']
      ],
      raw: true,
      nest: true,
      limit: 10
    })
    .then(restaurant => {
      restaurant = restaurant.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50),
        isFavorited: searchFavoritedRestaurants.map(d => d.id).includes(restaurant.id)
      }))
      return res.render('topRestaurants', {
        restaurant
      })
    })
    

  }
}

module.exports = restController
module.exports = restController