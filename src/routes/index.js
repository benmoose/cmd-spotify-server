const { Router } = require('express')
const { tracks, oauth } = require('../controllers')

const router = Router()

router.get('/oauth/authorise', oauth.authorise)
router.get('/oauth/token', oauth.getUserToken)
router.get('/search', tracks.search)

module.exports = router
