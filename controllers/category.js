const Category = require('../models/category');
const slugify = require('slugify');


exports.create = (req, res) => {
    const {name} = req.body
    console.log(name);
    let slug = slugify(name).toLowerCase()

    let category = new Category({ name, slug})

    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(data)
    })
}