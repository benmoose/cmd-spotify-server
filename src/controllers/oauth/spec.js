const querystring = require('querystring')
const url = require('url')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const assert = chai.assert

const server = require('../../index')
const { authorise } = require('./')

chai.use(chaiHttp)

describe('oauth endpoint', () => {
  describe('authorise()', () => {
    it('should return HTTP 302', (done) => {
      chai.request(server)
        .get('/v1/oauth/authorise')
        .redirects(0)
        .end((err, res) => {
          expect(res).to.have.status(302)
          done()
        })
    })
  
    it('should redirect to accounts.spotify endpoint', () => {
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
        })
      })

    it('should redirect to accounts.spotify with params set', () => {
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
        })
      })
  })
})
