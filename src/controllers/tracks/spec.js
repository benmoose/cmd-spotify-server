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
  })
})
