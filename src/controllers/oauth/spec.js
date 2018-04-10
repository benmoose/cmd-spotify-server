const querystring = require('querystring')
const url = require('url')
const nock = require('nock')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const assert = chai.assert

const server = require('../../index')

chai.use(chaiHttp)

describe('oauth endpoint', () => {
  describe('authorise()', () => {
    it('should redirect', (done) => {
      chai.request(server)
        .get('/v1/oauth/authorise')
        .redirects(0)
        .end((err, res) => {
          expect(res).to.redirect
          done()
        })
    })
  
    it('should redirect to accounts.spotify endpoint', (done) => {
      chai.request(server)
        .get('/v1/oauth/authorise')
        .redirects(0)
        .end((err, res) => {
          // sanity check
          assert.isDefined(res.headers.location, 'expect redirect to have a `location` header')
          // parse the location header
          const location = url.parse(res.headers.location)
          // test location header
          expect(location.host).to.equal('accounts.spotify.com')
          expect(location.pathname).to.equal('/authorize')
          expect(location.protocol).to.equal('https:')
          done()
        })
      })

    it('should redirect to accounts.spotify with params set', (done) => {
      chai.request(server)
        .get('/v1/oauth/authorise')
        .redirects(0)
        .end((err, res) => {
          assert.isDefined(res.headers.location, 'expect redirect to have a `location` header')
          // parse the location header query params
          const location = url.parse(res.headers.location)
          const qs = querystring.parse(location.query)
          // test location header
          expect(qs).to.have.all.keys([
            'client_id',
            'redirect_uri',
            'response_type',
            'scope'
          ])
          done()
        })
      })
  })

  describe('getUserToken()', () => {
    it('should return HTTP 400 when no params are sent', (done) => {
      chai.request(server)
        .get('/v1/oauth/token')
        .end((err, res) => {
          expect(res).to.have.status(400)
        })
        done()
    })

    it('should return HTTP 400 when error param is sent', (done) => {
      chai.request(server)
        .get('/v1/oauth/token')
        .query({ error: 'invalid_scope' })
        .end((err, res) => {
          expect(res).to.have.status(400)
          done()
        })
    })

    it('should return HTTP 400 when invalid code is sent', (done) => {
      // mock Spotify request
      const spotify = nock('https://accounts.spotify.com')
        .post('/api/token')
        .reply(400)
      
      chai.request(server)
        .get('/v1/oauth/token')
        .redirects(0)
        .query({ code: 'some-invalid-code' })
        .end((err, res) => {
          expect(res).to.have.status(400)
          done()
        })
    })

    it('should redirect when valid code is sent', (done) => {
      // mock Spotify request
      const spotify = nock('https://accounts.spotify.com')
        .post('/api/token')
        .reply(200, { data: { access_token: 'some-access-token' } })

      // call endpoint
      chai.request(server)
        .get('/v1/oauth/token')
        .redirects(0)
        .query({ code: 'some-valid-code' })
        .end((err, res) => {
          expect(res).to.redirect
          done()
        })
    })
  })
})

