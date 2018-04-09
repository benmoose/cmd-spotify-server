const url = require('url')
const querystring = require('querystring')
const axios = require('axios')

/**
 * Redirects requests to the spotify oauth authorisation page.
 * Use to initiate user authentication.
 */
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

/**
 * Called after a user takes action on the Spotify oauth authorisation page.
 * This method parses the response and redirects to the client callback URL on
 * success or displays an error if a user access token couldn't be obtained.
 */
const getUserToken = (req, res) => {
  const redirectUrl = process.env.SPOTIFY_REDIRECT_URL
  // parse components from the request query
  const error = req.query.error
  const code = req.query.code
  // check for error
  if (error) {
    res.status(400).json({ message: error })
  }
  // check for code
  else if (code) {
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
  }
  // something unexpected has happened...
  // in production you'd definitely want to log this
  else {
    res.status(400).json({ message: 'unknown error' })
  }
}

module.exports = {
  authorise,
  getUserToken
}
