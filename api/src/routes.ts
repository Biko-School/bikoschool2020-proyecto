import express from 'express'
import Lowdb from 'lowdb'
import { Meme } from 'Meme'
import { DatabaseSchema, MemeSchema } from './DatabaseSchema'
import { MemeService } from './Domain/memeService'

export function createRoutes(db: Lowdb.LowdbSync<DatabaseSchema>) {
  const router = express.Router()

  router.get('/memes', (req, res) => {
    const memeService = new MemeService(db)
    const trendingMemes = memeService.getTrendingMemes()

    res.status(200).json(trendingMemes)
  })

  router.get('/memes/search', (req, res) => {
    const filter = req.query.filter as string
    const trimmedFilter = filter.trim().replace(/\s+/g, ' ')

    if (trimmedFilter.length < 3) {
      res
        .status(403)
        .json('La longitud mínima de búsqueda debe de ser 3 carácteres')
    }

    const filteredMemes = db
      .get('memes')
      .filter((meme) =>
        meme.tags.some((tag) =>
          tag.toLowerCase().includes(trimmedFilter.toLowerCase()),
        ),
      )
      .sortBy('import_datetime')
      .reverse()
      .value()

    res.status(200).json(filteredMemes.map((filteredMeme) => map(filteredMeme)))
  })

  return router
}

function map(entity: MemeSchema): Meme {
  return {
    id: entity.id,
    title: entity.title,
    image: {
      width: entity.images.small.width,
      height: entity.images.small.height,
      url: entity.images.small.url,
    },
    date: entity.import_datetime,
    tags: [...entity.tags],
  }
}
