import { Request, Response } from 'express'
import { ErrorResponse } from './../models/Responses'
import { MemeDetails } from './../models/MemeDetails'
import { MemeDatabase} from './../models/DatabaseSchema'
import { mapMemeDatabaseToMemeDetails } from "./mappers"

export const detailsController = (req: Request, res: Response<MemeDetails | ErrorResponse>) => {
    const memeDatabase: MemeDatabase = req.context.db
    .get('memes').find({ id: req.params.id })
    .value()

  if(!memeDatabase) {
    res.status(404).send({
        status: 404,
        message: "Meme not found"
      })
  }

  const meme: MemeDetails= mapMemeDatabaseToMemeDetails(memeDatabase)
  res.status(200).json(meme)
  }
