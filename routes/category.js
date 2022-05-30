const express = require('express');
const router = express.Router();
// const {signup, signin, signout} = require('../controllers/auth')
const {create} = require('../controllers/category');

// Validator

const {runValidation} = require('../Validators');
const {categoryCreateValidator} = require('../Validators/category');

router.post('/category', categoryCreateValidator, runValidation, create);

module.exports = router;