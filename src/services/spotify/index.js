const querystring = require('querystring')
const axios = require('axios')

/**
 * Spotify class for access Spotify services
 */
class Spotify {
  constructor () {
    // set class constants
    this.baseURL = 'https://api.spotify.com'
    this.accountsBaseURL = 'https://accounts.spotify.com'
    this.clientId = process.env.SPOTIFY_CLIENT_ID
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    // cache access token and expiry time
    // null if authorisation error
    this.clientAccessToken = null
    this.clientAccessTokenExpiryTime = null
  }

  /**
   * Checks token and expiry time
   */
  _hasValidAccessToken () {
    const isTokenExpired = !this.clientAccessTokenExpiryTime
      || this.clientAccessTokenExpiryTime < Date.now()
    return !!(this.clientAccessToken && !isTokenExpired)
  }

  /**
   * Get a client access token for server-server communication 
   */
  _getClientAccessToken () {
    // encode client credentials with Basic authentication schema
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
    const authorization = `${this.clientId}:${this.clientSecret}`
    const authorizationBase64 = Buffer.from(authorization).toString('base64')
    // get access token using client credentials
    return axios.post(
      `${this.accountsBaseURL}/api/token`,
      querystring.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Authorization': `Basic ${authorizationBase64}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
      .then((res) => {
        // set class variables
        this.clientAccessTokenExpiryTime = Date.now() + (res.data.expires_in * 1000)
        this.clientAccessToken = res.data.access_token
        return res.data
      })
      .catch((error) => {
        this.clientAccessTokenExpiryTime = null
        this.clientAccessToken = null
        return error
      })
  }

  /**
   * Attempts to refresh the access token if it deosn't exist or is invalid.
   * Returns a promise which resolves if successful, or rejects if unsucessful
   */
  _authorise () {
    return new Promise((resolve, reject) => {
      if (this._hasValidAccessToken()) {
        // valid access token, request is good to go
        resolve()
      } else {
        // invalid token, attempt to get a new one
        this._getClientAccessToken()
          .then((data) => {
            // resolve if access_token present
            if (data.access_token) {
              resolve(data)
            } else {
              reject(data)
            }
          })
      }
    })
  }

  /**
   * Call Spotify's API
   * Config is an axios config: https://github.com/axios/axios#request-config
   */
  api ({ headers, ...config }) {
    // ensure access token is valid, then make request
    return this._authorise()
      .then(() => {
        // authorised and good to go
        return axios({
          baseURL: this.baseURL,
          // set the spotify api auth token
          headers: {
            'Authorization': `Bearer ${this.clientAccessToken}`,
            ...headers
          },
          ...config
        })
      })
  }
}

module.exports = Spotify
