const { Client } = require('pg');
const config = require('./models/pq_config.js')
// const client = new Client({
//   user: 'postgres',
//   password: '103293',
//   host: '127.0.0.1',
//   port: 5432,
//   database: 'postgres',
// });
const client = new Client(config);
async function test(){
        await client.connect();
        const result = await client.query('SELECT * FROM users;');
        console.log(result);
        await client.end()
}
test();
