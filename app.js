const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const db = require('./models')
const app = express()
const PORT = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' })) 
app.set('view engine', 'handlebars')
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`)
})

require('./routes')(app)

module.exports = app
