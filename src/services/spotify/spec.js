const expect = require('chai').expect
const Spotify = require('./')

describe('Spotify', () => {
  describe('properties', () => {
    it('should have all required properties', () => {
      const spotify = new Spotify()
      expect(spotify).to.have.all.keys([
        'baseURL',
        'accountsBaseURL',
        'clientId',
        'clientSecret',
        'clientAccessToken',
        'clientAccessTokenExpiryTime'
      ])
    })
  
    it('should have a string baseURL', () => {
      const spotify = new Spotify()
      expect(spotify.baseURL).to.be.a('String')
    })
  
    it('should have a string accountsBaseURL', () => {
      const spotify = new Spotify()
      expect(spotify.accountsBaseURL).to.be.a('String')
    })
  
    it('should have a null clientAccessToken upon instantiation', () => {
      const spotify = new Spotify()
      expect(spotify.clientAccessToken).to.equal(null)
    })
  
    it('should have a null clientAccessTokenExpiryTime upon instantiation', () => {
      const spotify = new Spotify()
      expect(spotify.clientAccessTokenExpiryTime).to.equal(null)
    })
  })
  
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
  
  describe('_getClientAccessToken()', () => {
    it('should return a Promise', () => {
      const spotify = new Spotify()
      expect(spotify._getClientAccessToken().then).to.be.a('Function')
      expect(spotify._getClientAccessToken().catch).to.be.a('Function')
    })
  })
  
  describe('_authorise()', () => {
    it('should return a Promise', () => {
      const spotify = new Spotify()
      expect(spotify._authorise().then).to.be.a('Function')
      expect(spotify._authorise().catch).to.be.a('Function')
    })
  })
  
  describe('api()', () => {
    it('should call _authorise() when no access token present', () => {
  
    })
  })
})
