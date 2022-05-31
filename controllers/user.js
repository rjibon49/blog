const User = require('../models/user')

// User Profile read

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};
