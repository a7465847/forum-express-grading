const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/admin/categories', categoryController.getCategories)
router.delete('/admin/categories/:id', categoryController.deleteCategory)
router.post('/admin/categories', categoryController.postCategory)

module.exports = router