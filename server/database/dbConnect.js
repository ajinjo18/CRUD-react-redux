const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/demo1')
.then(()=>{
    console.log('mongodb connected');
})
.catch(()=>{
    console.log('mongodb connection failed');
})

module.exports = mongoose