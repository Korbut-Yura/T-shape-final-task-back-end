'use strict';
const products = require('../mocks/products.json')

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*" 
    },
    body: JSON.stringify(
      {
        products: products,
      },
      null,
      2
    ),
  };
};
