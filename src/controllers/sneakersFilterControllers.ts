import { Request, Response } from 'express'
import sneakersModels from '../models/sneakersFilterModel'

interface FilterSneakersQueryParams {
  priceSort: string
  discountSort: string
  brandSort: string
  limit: string
  parsedLimit: number
  searchQuery: string
}

class SneakersFilterController {
  public filterSneakers = async (req: Request, res: Response) => {
    try {
      const { priceSort, discountSort, brandSort, limit, searchQuery } =
        req.query as unknown as FilterSneakersQueryParams
      const parsedLimit = parseInt(limit) || 10000
      const sneakers = await sneakersModels.getSneakers(
        priceSort,
        discountSort,
        brandSort,
        parsedLimit,
        searchQuery
      )
      return res.status(200).send(sneakers)
    } catch (error) {
      return res.status(500).send({ error })
    }
  }
}

export default new SneakersFilterController()
