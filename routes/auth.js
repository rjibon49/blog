const express = require('express')
const router = express.Router()
const {signup, signin, signout} = require('../controllers/auth')


// Validator

const {runValidation} = require('../Validators')
const {userSignupValidator, userSigninValidator} = require('../Validators/auth')

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

module.exports = router;