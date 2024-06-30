const {Client} = require('pg');
const pg_config = require('./pg_config');

async function products_display(username) {
    // Query to DB and get all data from products table
    const client = new Client(pg_config);
    await client.connect();
    // Check the role and shop_id
    const info_query = {
        text: 'SELECT shop_id, role_id FROM users WHERE username=$1',
        values: [username],
      }
    const info = await client.query(info_query);
    let role_id = info.rows[0].role_id;    
    let shop_id = info.rows[0].shop_id;
    let query_string = "";
    if (role_id == 3) {
        // shop role
        query_string = {
            text: 'SELECt * FROM products WHERE shop_id=$1',
            values: [shop_id],
        } 
    } else {
        // Director or Admin role
        query_string = 'SELECT * FROM products';
    }
    
    const result = await client.query(query_string);
    let html_table = `<table border='1'><tr>`;
    const headers_list = result.fields.map(field => field.name);

    headers_list.forEach(header => {
        html_table += `<th>${header}</th>`;
    });
    html_table += `<th>Actions</th></tr>`;

    result.rows.forEach(row => {
        html_table += `<tr>`;
        headers_list.forEach(column => {
            html_table += `<td>${row[column]}</td>`;
        });
        html_table += `<td>
            <a href="/users/update?product_id=${row.product_id}"><button>Update</button></a>
            <a href="/users/delete?product_id=${row.product_id}"><button>Delete</button></a>
        </td>`;
        html_table += `</tr>`;
    });
    html_table += `<tr><td colspan="${headers_list.length + 1}">
        <a href="/users/create"><button>Create</button></a>
    </td></tr>`;
    html_table += `</table>`;

    await client.end();
    return html_table;
}
async function create_product(product) {
    const client = new Client(pg_config);
    await client.connect();

    const query_string = {
        text: 'INSERT INTO products (name, price, amount, shop_id) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [product.name, product.price, product.amount, product.shop_id],
    };

    const result = await client.query(query_string);
    await client.end();
    return result.rows[0];
}

async function update_product(product_id, product, ) {
    const client = new Client(pg_config);
    await client.connect();

    const query_string = {
        text: 'UPDATE products SET name = $1, price = $2,amount =$3, shop_id = $4 WHERE product_id = $5 RETURNING *',
        values: [product.name, product.price, product.amount, product.shop_id, product_id],
    };

    const result = await client.query(query_string);
    await client.end();
    return result.rows[0];
}

async function delete_product(product_id) {
    const client = new Client(pg_config);
    await client.connect();

    const query_string = {
        text: 'DELETE FROM products WHERE product_id = $1 RETURNING *',
        values: [product_id],
    };

    const result = await client.query(query_string);
    await client.end();
    return result.rows[0];
}

module.exports = { products_display, create_product, update_product, delete_product };