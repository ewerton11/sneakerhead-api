import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2'
import databaseConnection from '../config/database'

class SneakersEqual {
  private connection = databaseConnection

  public sneakersEqual = async (req: Request, res: Response) => {
    const name = req.query.name as string

    const query = `SELECT s.id, s.image FROM sneakers s WHERE s.name = ?`
    const value = [name]

    this.connection.query(query, value, (error, result: RowDataPacket[]) => {
      if (error) {
        return res
          .status(500)
          .send({ message: 'Error getting sneakers information', error })
      }

      if (result.length > 0) {
        return res.status(200).send(result)
      } else {
        return res
          .status(500)
          .send({ message: 'Error getting sneakers information', error })
      }
    })
  }
}

export default new SneakersEqual()
