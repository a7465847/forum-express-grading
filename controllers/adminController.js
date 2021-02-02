const app = require('../app')
const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  // 瀏覽全部資料頁面
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  // 新增資料頁面
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  // 送出一筆新增資料
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    })
      .then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
  },
  //瀏覽一筆資料頁面
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },
  // 編輯一筆資料頁面
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },
  // 送出一筆編輯資料
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
      })
  },
  //刪除一筆資料
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  }

}
module.exports = adminController 