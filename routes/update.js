var express = require('express');
var router = express.Router();
const {authented} = require('../models/authenicator');
const {users} = require('../routes/users')
const { update_product, products_display } = require('../models/products_display');
const { Client } = require('pg');
const pg_config = require('../models/pg_config');


async function get_product(product_id) {
    const client = new Client(pg_config);
    await client.connect();

    const query_string = {
        text: 'SELECT * FROM products WHERE product_id = $1',
        values: [product_id],
    };
    const result = await client.query(query_string);
    await client.end();
    return result.rows[0];
}

router.get('/', async function(req, res, next) {
    let product_id = req.query.product_id;
    let product = await get_product(product_id);
    res.render('update', { title: 'Update Product', product: product });
});

router.post('/', async function(req, res, next) {
    let { product_id, name, price, amount, shop_id } = req.body;
    let product = { name, price, amount, shop_id };
    await update_product(product_id, product); // Pass the entire product object
    html_table = await products_display(req.session.username);
    res.render('users', {title: 'User Page', products_table: html_table});
    });

module.exports = router;
