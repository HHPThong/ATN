var express = require('express');
var router = express.Router();
const {authented} = require('../models/authenicator');
const { delete_product } = require('../models/products_display');
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
    res.render('delete', { title: 'delete Product', product: product });
});

router.post('/', async function(req, res, next) {
  let { product_id } = req.body;
  await delete_product(product_id);
  html_table = await products_display(req.session.username);
  res.render('users', {title: 'User Page', products_table: html_table});
});

module.exports = router;
