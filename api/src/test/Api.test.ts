import request from 'supertest'
import app from '../app'

const apiPath = '/api'
const rutaMemes = apiPath + '/memes'
const HTTP_OK = 200

describe('GET /api/memes', function () {
  it('responds with 200', function (done) {
    request(app).get(rutaMemes).expect(HTTP_OK, done)
  })
  it('responds with array', function (done) {
    request(app)
      .get(rutaMemes)
      .expect(HTTP_OK)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array)
        done()
      })
  })
})
