import { createApp } from '../app'
import request from 'supertest'
import Memory from 'lowdb/adapters/Memory'
import { DatabaseSchema } from 'test/DatabaseSchema'
import low from 'lowdb'
import dbTest from "../fixtures/db.json"
import { aMeme } from "./builders/memeBuilder"
import { aDatabase } from "./builders/dataBaseBuilder"

describe('/api/memes', () => {
  it('devuelve los memes más recientes ordenados por fecha decreciente', function(done){
    const memeUno = aMeme().withDate("2020-08-20 02:24:22").build()
    const memeDos = aMeme().withDate("2020-08-26 22:51:59").build()
    const memeTres = aMeme().withDate("2020-08-17 19:05:41").build()
    const memeCuatro = aMeme().withDate("2020-09-20 02:24:22").build()
    const memeCinco = aMeme().withDate("2020-12-26 22:51:59").build()
    const memeSeis = aMeme().withDate("2020-01-17 19:05:41").build()
    const arrayMemes = [memeUno, memeDos, memeTres, memeCuatro, memeCinco, memeSeis]
    const db = aDatabase().withMemes(arrayMemes).build()
    const app = implementApp(db)
    request(app).get('/api/memes')
    .expect(200).then(response =>{
      expect(response.body).toHaveLength(3)
      expect(response.body[0]).toHaveProperty('import_datetime', '2020-12-26 22:51:59')
      expect(response.body[1]).toHaveProperty('import_datetime', '2020-09-20 02:24:22')
      expect(response.body[2]).toHaveProperty('import_datetime', '2020-08-26 22:51:59')
      done()
    })
  })
})

function implementApp(dataBase){
  const adapter = new Memory<DatabaseSchema>("")
    const db = low(adapter)
    db.defaults(dataBase).write()
    return createApp(db)
}

