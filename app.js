const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const PORT = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' })) 
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`)
})

require('./routes')(app)

module.exports = app
