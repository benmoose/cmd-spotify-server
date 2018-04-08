const url = require('url')
const querystring = require('querystring')
const axios = require('axios')

const authorise = (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL
  // build the authorise url
  const authoriseUrl = url.format({
    ...url.parse('https://accounts.spotify.com/authorize'),
    query: {
      client_id: clientId,
      redirect_uri: redirectUrl,
      response_type: 'code',
      scope: 'playlist-read-private playlist-modify-private playlist-modify-public'
    }
  })
  // redirect to spotify authorisation page
  res.redirect(authoriseUrl)
}

const getUserToken = (req, res) => {
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL
  const error = req.query.error
  const code = req.query.code
  if (error) {
    res.status(400).json({ message: error })
  } else if (code) {
    // successfully authorised
    axios({
      baseURL: 'https://accounts.spotify.com',
      url: '/api/token',
      method: 'post',
      data: querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: redirectUrl,
        code
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then((response) => {
        const redirectUrl = url.format({
          ...url.parse(process.env.AUTHORIZATION_REDIRECT_URL),
          query: response.data
        })
        res.redirect(redirectUrl)
      })
      .catch(err => {
        res.json({ message: `An error occurred: ${err.response.data.error}` })
      })
  } else {
    res.status(400).json({ message: 'unknown error' })
  }
}

module.exports = {
  authorise,
  getUserToken
}
