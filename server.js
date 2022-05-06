const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

// Bring Router

const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')


//  app
const app = express()

//DATABASE
mongoose.connect(process.env.DATABASE_CLOUD, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DataBase Connected'));

//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

//cors
if(process.env.NODE_ENV == 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}))
}


//Routes Middlewares

app.use('/api', blogRoutes);
app.use('/api', authRoutes);


//routes
// app.get('/api', (req, res) => {
//     res.json({time: Date().toString()})
// })

//port
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})