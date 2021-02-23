const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {
        return callback({ categories: categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name didn\'t exist'})
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          return callback({ status: 'success', message: 'Category was successfully created' })
        })
    }
  },
  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            return callback({ status: 'success', message: '' })
          })
      })
      .catch(err => res.sendStatus(500))
  }
}

module.exports = categoryService