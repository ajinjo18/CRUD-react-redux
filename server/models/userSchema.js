const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    profilePicture:{
        type:String
    },
    location:{
        type:String
    },
    occupation:{
        type:String
    }
})

const userCollection = new mongoose.model('users',userSchema)

module.exports = userCollection