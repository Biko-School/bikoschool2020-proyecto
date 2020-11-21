import express from 'express'
import { recentsController, searchController, detailsController } from "./controllers"

export const router = express.Router()

router.get('/memes', recentsController)
router.get('/memes/search', searchController) 
router.get('/meme/:id', detailsController)