const express = require('express')
const router = express.Router()
const {signup} = require('../controllers/auth')


// Validator

const {runValidation} = require('../Validators')
const {userSignupValidator} = require('../Validators/auth')

router.post('/signup', userSignupValidator, runValidation, signup);

module.exports = router;