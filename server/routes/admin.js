const express = require('express')
const router = express.Router()

const admin = require('../controller/adminController')

router.post('/adduser',admin.addUser)
router.post('/edituser',admin.editUser)
router.post('/deleteuser',admin.deleteUser)


module.exports = router