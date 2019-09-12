const path = require('path')
const port = process.env.PORT || 8000
const express = require('express')
const app = express()
const api = require('./server/route/api')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL || 'mysql://root:@localhost/test')



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})


app.use(express.static(path.join(__dirname, 'build')))


app.use('/', api)


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        app.listen(port, () => console.log(`Running server on port ` + port))
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })




