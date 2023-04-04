import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2'
import databaseConnection from '../config/database'

class InfoSneaker {
  private connection = databaseConnection

  public infoSneaker = async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id)

      const query = `SELECT s.id, s.name, s.brand, st.store, p.price,
        s.previous_price, p.discount, ph.price_history, s.image, st.details,
        s.created_at, s.updated_at 
        FROM sneakers s
        JOIN stores st ON s.id = st.sneaker_id
        JOIN prices p ON st.id = p.store_id
        JOIN prices_history ph ON st.id = ph.store_id
        WHERE s.id = ?`
      const values = [id]

      this.connection.query(
        query,
        values,
        (error, results: RowDataPacket[]) => {
          if (error) {
            return res
              .status(500)
              .send({ message: 'Error getting sneakers information', error })
          }

          if (results.length > 0) {
            res.status(200).send(results)
          } else {
            res.status(400).send({ message: 'sneakers not found' })
          }
        }
      )
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Error getting sneakers information', error })
    }
  }
}

export default new InfoSneaker()
