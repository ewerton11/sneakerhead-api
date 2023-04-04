import databaseConnection from '../config/database'

//search for nike sneakers in the database and filter
class SneakersModel {
  private connection = databaseConnection

  public async getSneakers(
    priceSort: string,
    discountSort: string,
    brandSort: string,
    parsedLimit: number,
    searchQuery: string
  ) {
    return new Promise((resolve, reject) => {
      let query = `SELECT s.id, s.name, s.brand, st.store, p.price, s.previous_price,
      p.discount, s.image, st.details, s.created_at, s.updated_at 
      FROM sneakers s
      JOIN stores st ON s.id = st.sneaker_id
      JOIN prices p ON st.id = p.store_id`

      if (searchQuery) {
        query += ` WHERE s.name LIKE '%${searchQuery}%'`
      }

      if (brandSort) {
        query += searchQuery
          ? ` AND s.brand = '${brandSort}'`
          : ` WHERE s.brand = '${brandSort}'`
      }

      if (discountSort) {
        query +=
          searchQuery || brandSort
            ? ' AND p.discount IS NOT NULL'
            : ' WHERE p.discount IS NOT NULL'

        if (priceSort) {
          query += ` ORDER BY p.price ${
            priceSort === 'AscPrice' ? 'ASC' : 'DESC'
          }`
        } else {
          query += ' ORDER BY p.discount DESC'
        }
      }

      if (priceSort && !discountSort) {
        query += ` ORDER BY p.price ${
          priceSort === 'AscPrice' ? 'ASC' : 'DESC'
        }`
      }

      if (parsedLimit) {
        query += ` LIMIT ${parsedLimit}`
      }

      this.connection.query(query, (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      })
    })
  }
}

export default new SneakersModel()
