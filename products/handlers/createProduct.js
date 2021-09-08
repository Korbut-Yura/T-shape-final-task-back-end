'use strict';
const {Client} = require('pg')
const {ErrorResponse} = require('../errors/ErrorResponse')

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

module.exports.createProduct = async (event) => {
  const client = new Client(dbOptions);
  await client.connect()

  try{
    const { title, description, price, count, photourl } = JSON.parse(event.body)

    await client.query(`
      WITH first_insert AS (
        INSERT INTO products (title, description, price, photourl)
        VALUES ($$${title}$$, $$${description}$$, '${price}', '${photourl}')
        RETURNING id 
      )
      INSERT INTO stocks (product_id, count)
      SELECT id, '${count}'
      FROM first_insert
    `)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*" 
      }
    };
  } catch (err) {
    console.error(err);
    return  new ErrorResponse(err.message)
  } finally {
    client.end()
  }
};
