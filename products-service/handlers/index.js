const { getProductsList } = require('./getProductsList')
const { getProductsById } = require('./getProductsById')
const { createProduct } = require('./createProduct')

module.exports = { 
    getProductsList,
    getProductsById,
    createProduct 
}