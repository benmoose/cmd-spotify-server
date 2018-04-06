const { Router } = require('express')
const controller = require('../controllers')

const router = Router()

router.get('/search', controller.search.handler)

module.exports = router
