const express = require('express');
const cors = require('cors')
const path = require('path')


const app = express()

const db = require('./database/dbConnect')
const userCollection = require('./models/userSchema')

const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.urlencoded({extended:true}))


app.use('/',userRouter)
app.use('/admin',adminRouter)




app.listen(3001,()=>{
    console.log('server running');
})
