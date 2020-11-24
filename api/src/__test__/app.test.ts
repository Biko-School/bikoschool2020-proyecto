import request from 'supertest'
import { createApp } from '../app'
import Memory from 'lowdb/adapters/Memory'
import { DatabaseSchema } from '../models/DatabaseSchema'
import fixtureDb from './fixtures/db.json'
import Lowdb from 'lowdb'
import { aMeme } from './builders/memeBuilder'

describe('/api/memes', () => {
  it('responds should be an Array with 50 memes', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    db.defaults(fixtureDb).write()

    const app = createApp(db)
    request(app)
      .get('/api/memes')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toHaveLength(50)
        return done()
      })
  })
  it('responds should be an Array with the most recent memes', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const mostRecent = '2020-08-20 02:24:24'
    const middleDate = '2020-08-20 02:24:22'
    const lessRecent = '2020-08-18 02:24:22'
    const oldest = '2020-08-18 01:24:22'

    const memeA = aMeme('1').withDate(lessRecent).build()
    const memeB = aMeme('2').withDate(mostRecent).build()
    const memeC = aMeme('3').withDate(middleDate).build()
    const memeD = aMeme('4').withDate(oldest).build()

    db.defaults({ memes: [memeA, memeD, memeC, memeB] }).write()

    const app = createApp(db, { numRecentMemes: 3 })
    request(app)
      .get('/api/memes')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toHaveLength(3)
        expect(response.body.memes).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '4',
            }),
          ]),
        )
        return done()
      })
  })
  it('response should be memes ordered by descendent date', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const mostRecent = '2020-08-20 02:24:24'
    const middleDate = '2020-08-20 02:24:22'
    const lessRecent = '2020-08-18 02:24:22'

    const memeA = aMeme('1').withDate(lessRecent).build()
    const memeB = aMeme('2').withDate(mostRecent).build()
    const memeC = aMeme('3').withDate(middleDate).build()

    db.defaults({ memes: [memeA, memeB, memeC] }).write()

    const app = createApp(db)
    request(app)
      .get('/api/memes')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes[0].creationDate).toEqual(mostRecent)
        expect(response.body.memes[1].creationDate).toEqual(middleDate)
        expect(response.body.memes[2].creationDate).toEqual(lessRecent)
        return done()
      })
  })
})

describe('Search memes', () => {
  it('Should show a meme as result from user search', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const memeA = aMeme('1').withTags(['movie']).build()
    const memeB = aMeme('2').withTags(['another']).build()

    db.defaults({ memes: [memeA, memeB] }).write()

    const app = createApp(db)
    const searchTerm = 'movie'
    request(app)
      .get(`/api/memes/search?q=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toHaveLength(1)
        expect(response.body.memes[0].id).toBe('1')
        return done()
      })
  })
  it('Should ignore uppercase in search term', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const memeA = aMeme('1').withTags(['movie']).build()
    const memeB = aMeme('2').withTags(['another']).build()

    db.defaults({ memes: [memeA, memeB] }).write()

    const app = createApp(db)
    const searchTerm = 'Movie'
    request(app)
      .get(`/api/memes/search?q=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toHaveLength(1)
        expect(response.body.memes[0].id).toBe('1')
        return done()
      })
  })
  it('Should show memes that contains the search term partially', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const memeA = aMeme('1').withTags(['the simpsons']).build()
    const memeB = aMeme('2').withTags(['simpsons']).build()
    const memeC = aMeme('3').withTags(['black']).build()
    const memeD = aMeme('4').withTags(['simpson']).build()

    db.defaults({ memes: [memeA, memeB, memeC, memeD] }).write()

    const app = createApp(db)
    const searchTerm = 'Simpson'
    request(app)
      .get(`/api/memes/search?q=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toHaveLength(3)
        expect(response.body.memes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: '1' }),
            expect.objectContaining({ id: '2' }),
            expect.objectContaining({ id: '4' }),
          ]),
        )

        return done()
      })
  })
  it('Should show memes by user search order by date', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const mostRecent = '2020-08-20 02:24:24'
    const middleDate = '2020-08-20 02:24:22'
    const lessRecent = '2020-08-18 02:24:22'

    const memeA = aMeme('1')
      .withTags(['the simpsons'])
      .withDate(mostRecent)
      .build()
    const memeB = aMeme('2').withTags(['simpsons']).withDate(middleDate).build()
    const memeC = aMeme('3').withTags(['simpson']).withDate(lessRecent).build()

    db.defaults({ memes: [memeA, memeC, memeB] }).write()

    const app = createApp(db)
    const searchTerm = 'Simpson'
    request(app)
      .get(`/api/memes/search?q=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toHaveLength(3)
        expect(response.body.memes[0].creationDate).toEqual(mostRecent)
        expect(response.body.memes[1].creationDate).toEqual(middleDate)
        expect(response.body.memes[2].creationDate).toEqual(lessRecent)

        return done()
      })
  })
  it("User can't search with a term whose length is less than three characters", (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const app = createApp(db)
    const searchTerm = 'ab'
    request(app).get(`/api/memes/search?q=${searchTerm}`).expect(400, done)
  })
  it('Should ignore whitespaces after & before the search term', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )
    const searchTerm = ' the simpsons '
    const memeA = aMeme('1').withTags(['the simpsons']).build()

    db.defaults({ memes: [memeA] }).write()
    const app = createApp(db)
    request(app)
      .get(`/api/memes/search?q=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: '1' })]),
        )

        return done()
      })
  })
  it('Should ignore more than one space betweeen words', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )

    const searchTerm = 'the   simpsons'
    const memeA = aMeme('1').withTags(['the simpsons']).build()

    db.defaults({ memes: [memeA] }).write()
    const app = createApp(db)
    request(app)
      .get(`/api/memes/search?q=${searchTerm}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.memes).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: '1' })]),
        )

        return done()
      })
  })

  describe('Meme details', () => {
    it('Should show a meme details from meme id selected', (done) => {
      const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
        new Memory<DatabaseSchema>(''),
      )
      const id = "id_01"
      const author = {
        avatar_url: 'news/hggHJAb9dlmy.gif',
        banner_image:'news/s2pdBLQhzA3Z.gif',
        banner_url:'news/s2pdBLQhzA3Z.gif',
        profile_url: 'https://giphy.com/news/',
        username: 'news',
        display_name: 'GIPHY News',
        is_verified: true,
      }
      const tags = ["#movie"]
      const meme = aMeme(id).withAuthor(author).withTags(tags).build()
      db.defaults({ memes: [meme] }).write()

      const app = createApp(db)
      request(app)
        .get(`/api/meme/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id,
            tags,
            title: meme.title,
            url: meme.images.original.url,
            author: {
              displayName: author.display_name,
              avatarUrl: author.avatar_url
            }
          })

          return done()
        })
    })

    it('Should show a meme details from meme id selected without author', (done) => {
      const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
        new Memory<DatabaseSchema>(''),
      )
      const id = "id_01"

      const tags = ["#movie"]
      const meme = aMeme(id).withTags(tags).build()
      db.defaults({ memes: [meme] }).write()

      const app = createApp(db)
      request(app)
        .get(`/api/meme/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id,
            tags,
            title: meme.title,
            url: meme.images.original.url
          })

          return done()
        })
    })
  })

  it('Should notify that there is no meme found with that id', (done) => {
    const db: Lowdb.LowdbSync<DatabaseSchema> = Lowdb(
      new Memory<DatabaseSchema>(''),
    )
    const meme = aMeme("1").build()
    db.defaults({ memes: [meme] }).write()

    const app = createApp(db)
    const id = "notfound"

    request(app)
    .get(`/api/meme/${id}`)
    .expect('Content-Type', /json/)
    .expect(404, done)
  })
})
