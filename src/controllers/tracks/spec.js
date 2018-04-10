const nock = require('nock')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const server = require('../../index')

describe('tracks endpoint', () => {
  describe('search()', () => {
    it('should return HTTP 400 when no `q` param is sent', (done) => {
      chai.request(server)
        .get('/v1/search')
        .end((err, res) => {
          expect(res).to.have.status(400)
          done()
        })
    })

    it('should return JSON when successful', (done) => {
      // response object
      const data = {
        items: {
          href: 'foo',
          items: []
        }
      }
      // mock spotify
      const spotify = nock('https://api.spotify.com')
        .get('/v1/search')
        .reply(200, { data })
      
      chai.request(server)
        .get('/v1/search')
        .query({ q: 'some-query' })
        .end((err, res) => {
          expect(res).to.be.json
          done()
        })
    })
  })
})
