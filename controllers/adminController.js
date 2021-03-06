const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User

const adminService = require('../services/adminService.js')

const adminController = {
  // 進入管理員頁面
  getUser: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users })
    })
  },
  // 送出編輯管理員資料
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then(users => users.update({ isAdmin: !users.isAdmin }))
      .then((restaurant) => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect('/admin/users')
      })

  },
  // 瀏覽全部資料頁面
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  // 進入新增資料頁面
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  // 送出一筆新增資料
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  //進入瀏覽一筆資料頁面
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  // 進入編輯一筆資料頁面
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  // 送出一筆編輯資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  
  //刪除一筆資料
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  }

}
module.exports = adminController 