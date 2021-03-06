'use strict';
const { Client } = require('pg')
const { ErrorResponse } = require('../errors/ErrorResponse')
const middy = require('@middy/core')
const inputOutputLogger = require('@middy/input-output-logger')

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

const getProductsList = middy(async (event) => {
  const client = new Client(dbOptions);
  await client.connect()

  try{
    const { rows } = await client.query(`
      SELECT id, title, description, price, photoUrl, count 
      FROM products
      JOIN stocks ON products.id = stocks.product_id
    `)

    return {
      statusCode: 200,
      body: JSON.stringify( rows, null, 2 ),
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
});

getProductsList.use(inputOutputLogger())

module.exports = {getProductsList}