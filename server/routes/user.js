const express = require('express')
const router = express.Router()

const upload = require('../models/multer')
const user = require('../controller/userController')

router.post('/signup',user.signup)
router.post('/login',user.login)
router.post('/profilepicture',upload.single('file'),user.profileUpload)
router.post('/profileimage',user.getProfile)
router.post('/editprofile',user.editProfile)
router.get('/users',user.users)


module.exports = router