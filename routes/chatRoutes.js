const { Router } = require('express')
const cartController = require('../controllers/chatController')
const { policiesCustomer } = require('../middlewares/policiesMiddleware')

const router = Router()

router.get('/', policiesCustomer, cartController.getChat)

module.exports = router