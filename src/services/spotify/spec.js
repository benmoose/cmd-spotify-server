const expect = require('chai').expect
const Spotify = require('./')

describe('_hasValidAccessToken()', () => {
  it('returns false when no access token', () => {
    const spotify = new Spotify()
    expect(spotify._hasValidAccessToken()).to.equal(false)
  })
  
  it('returns false when access token has expired', () => {
    const spotify = new Spotify()
    spotify.clientAccessToken = 'some-access-token'
    spotify.clientAccessTokenExpiryTime = Date.now() - 1000
    expect(spotify._hasValidAccessToken()).to.equal(false)
  })
  
  it('returns true when valid access token exists', () => {
    const spotify = new Spotify()
    spotify.clientAccessToken = 'some-access-token'
    spotify.clientAccessTokenExpiryTime = Date.now() + 1000
    expect(spotify._hasValidAccessToken()).to.equal(true)
  })
})
