var express = require('express');
var router = express.Router();
const {authented} = require('../models/authenicator');
const { create_product } = require('../models/products_display');

router.get('/', function(req, res, next) {
    res.render('create', { title: 'Create Product' });
});

router.post('/', async function(req, res, next) {
    let { name, price, amount, shop_id } = req.body;
    let product = { name, price, amount, shop_id };
    await create_product(product); // Pass the entire product object
    html_table = await products_display(req.session.username);
    res.render('users', {title: 'User Page', products_table: html_table});
});

module.exports = router;
