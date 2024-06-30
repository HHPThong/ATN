const {Client} = require('pg');
const pg_config = require('./pg_config');

async function authented(user, pass) {
    let auth = false;
    const client = new Client(pg_config);
    await client.connect();
    const query = {
      text: 'SELECT * FROM users WHERE username=$1 AND password=$2',
      values: [user, pass],
    }
    const result = await client.query(query);
    console.log(result);
    await client.end();
    if (result.rowCount == 1) {
      auth = true;
    }
    return auth;
  }

module.exports = authented;