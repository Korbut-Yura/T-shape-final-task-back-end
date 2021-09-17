'use strict';
const { Client } = require('pg')
const { ErrorResponse } = require('../errors/ErrorResponse')
const middy = require('@middy/core')
const inputOutputLogger = require('@middy/input-output-logger')

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env

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

const getProductsById = middy(async (event, context) => {
  const client = new Client(dbOptions);
  await client.connect()

    try { 
        const { productId } = event.pathParameters
        const { rows } = await client.query(`
          SELECT id, title, description, price, photoUrl, count 
          FROM products
          JOIN stocks ON products.id = stocks.product_id
          WHERE products.id = '${productId}'
      `).catch(()=>{
        throw new ErrorResponse(`There is no products with id ${productId}`, 404)
      })
      return {
        statusCode: 200,
        body: JSON.stringify( rows, null, 2 ),
        headers: {
          "Access-Control-Allow-Origin": "*" 
        }
      };
    } catch (_err) {
        let err = _err
        if (!(err instanceof ErrorResponse) ){
            console.error(err);
            err= new ErrorResponse()
        }
       
        return err
    } finally {
      client.end()
    }
});

getProductsById.use(inputOutputLogger())

module.exports = {getProductsById}
