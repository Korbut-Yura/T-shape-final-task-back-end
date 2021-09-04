'use strict';
const products = require('../mocks/products.json')
const {ErrorResponse} = require('../errors/ErrorResponse')

module.exports.getProductsById = async (event, context) => {
    try { 
        const {productId} = event.pathParameters
        const currentProduct = products.find(({id})=> id === productId)
        console.log('currentProduct',currentProduct, productId );
        if (!currentProduct) {
            throw new ErrorResponse(`There is no products with id ${productId}`, 404)
        }
          return {
            statusCode: 200,
            body: JSON.stringify(
              {
                product: currentProduct,
              },
              null,
              2
            ),
          };
    } catch (_err) {
        let err = _err
        if (!(err instanceof ErrorResponse) ){
            console.error(err);
            err= new ErrorResponse()
        }
       
        return err
    }

};
