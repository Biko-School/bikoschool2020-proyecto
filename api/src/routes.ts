import express from 'express'
import { MemeRepositoryLowDB } from './infrastructure/memeRepositoryLowDB'
import Lowdb from 'lowdb'
import { DatabaseSchema } from './DatabaseSchema'
import { MemeService } from './Domain/memeService'

export function createRoutes(db: Lowdb.LowdbSync<DatabaseSchema>) {
  const router = express.Router()

  router.get('/memes', (req, res) => {
    const memeRepository = new MemeRepositoryLowDB(db)
    const memeService = new MemeService(memeRepository)
    const trendingMemes = memeService.getTrendingMemes()

    res.status(200).json(trendingMemes)
  })

  router.get('/memes/search', (req, res) => {
    const filter = req.query.filter as string

    const memeRepository = new MemeRepositoryLowDB(db)
    const memeService = new MemeService(memeRepository)

    try {
      const memes = memeService.searchMemes(filter)
      res.status(200).json(memes)
    } catch (error) {
      res
        .status(403)
        .json('La longitud mínima de búsqueda debe de ser 3 carácteres')
    }
  })

  return router
}
