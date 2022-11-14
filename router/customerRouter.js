const express = require('express');
const route = express.Router();
const { getCustomer, postCustomer, deleteCustomer, patchCustomerController, getCustomerByIdController, putCustomerController } = require('../controllers/customer')


route.delete('/:id', deleteCustomer)
route.post('/', postCustomer)
route.patch('/:id', patchCustomerController)
route.get('/', getCustomer)
// route.get('/newuser', (req,res)=>{
//     res.send('new user')
// })
route.get('/:id', getCustomerByIdController)
route.put('/:id', putCustomerController)

module.exports = route;