import request from 'supertest'
import { createApp } from './app'
import low from 'lowdb'
import Memory from 'lowdb/adapters/Memory'
import { DatabaseSchema } from './DatabaseSchema'
import fixtureDb from './fixtures/db.json'
import { db } from './database'

describe('/api/memes', () => {
  beforeEach(() => {
    db.defaults({ memes: [] }).write()
  })

  it('responds should be an Array', (done) => {
    const app = createApp(db)

    request(app)
      .get('/api/memes')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array)
        return done()
      })
  })
  it('responds should be an Array with 50 memes', (done) => {
    db.set('memes', fixtureDb.memes).write()

    const app = createApp(db)
    request(app)
      .get('/api/memes')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(50)
        return done()
      })
  })
})
