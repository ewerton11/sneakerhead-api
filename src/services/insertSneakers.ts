import { ResultSetHeader, RowDataPacket } from 'mysql2'
import connection from '../config/database'
import { IDataSneakers } from '../integrations/sneakersNike'

class InsertSneakers {
  private connection = connection

  async insertData(data: Array<IDataSneakers>) {
    // const uniqueSneakers = Array.from(
    //   new Set(data.map((item) => item.name))
    // ).map((name) => {
    //   return data.find((item) => item.name === name)
    // })

    const sneakersFilter = data.filter(
      (sneakers) => !sneakers.image.startsWith('data') && sneakers.price !== 0
    )

    console.log(sneakersFilter.length, 'data sevices linha 15')
    sneakersFilter.forEach((item) => {
      const checkQuery =
        'SELECT sneakers.id, stores.id as store_id, stores.sneaker_id, sneakers.name, ' +
        'stores.store, prices.price, sneakers.image ' +
        'FROM sneakers ' +
        'JOIN stores ON sneakers.id = stores.sneaker_id ' +
        'JOIN prices ON stores.id = prices.store_id ' +
        'WHERE sneakers.name = ? And image = ?'
      const checkValue = [item.name, item.image]

      this.connection.query(
        checkQuery,
        checkValue,
        (error, result: RowDataPacket[]) => {
          if (error) throw error

          if (result.length > 0) {
            if (result[0].price !== item?.price) {
              //verificar outros valores que talves seja bom atualizar
              const sneakerId = result[0].id

              const updateQuery =
                'UPDATE sneakers ' +
                'JOIN stores ON sneakers.id = stores.sneaker_id ' +
                'JOIN prices ON stores.id = prices.store_id ' +
                'SET sneakers.previous_price = ?, ' +
                'stores.details = ?, ' +
                'prices.price = ?, ' +
                'prices.discount = ? ' +
                'WHERE sneakers.id = ?'
              const update = [
                item?.previous_price,
                item?.details,
                item?.price,
                item?.discount,
                sneakerId,
              ]

              this.connection.query(updateQuery, update)

              const insertNewPriceHistory =
                'INSERT INTO prices_history (price_history, store_id) VALUES (?, ?)'
              const dataNewPriceHistory = [item?.price, result[0].store_id]

              this.connection.query(insertNewPriceHistory, dataNewPriceHistory)
            } else if (result[0].store !== item?.store) {
              const insertStore =
                'INSERT INTO stores (store, details, sneaker_id) VALUES (?)'
              const dataStore = [
                [item?.store, item?.details, result[0].sneaker_id],
              ]

              this.connection.query(
                insertStore,
                dataStore,
                (error, result: ResultSetHeader) => {
                  if (error) throw error

                  const storeId = result.insertId
                  const insertPrice =
                    'INSERT INTO prices (price, discount, store_id) VALUES (?)'
                  const dataPrice = [[item?.price, item?.discount, storeId]]

                  this.connection.query(insertPrice, dataPrice)

                  const insertPriceHistory =
                    'INSERT INTO prices_history (price_history, store_id) VALUES (?, ?)'
                  const dataPriceHistory = [item?.price, storeId]

                  this.connection.query(insertPriceHistory, dataPriceHistory)
                }
              )
            }
          } else {
            const insertSneakers =
              'INSERT INTO sneakers (name, previous_price, image, brand) VALUES (?)'
            const dataSneakers = [
              [item?.name, item?.previous_price, item?.image, item?.brand],
            ]

            this.connection.query(
              insertSneakers,
              dataSneakers,
              (error, result: ResultSetHeader) => {
                if (error) throw error

                const sneakerId = result.insertId
                const insertStore =
                  'INSERT INTO stores (store, details, sneaker_id) VALUES (?)'
                const dataStore = [[item?.store, item?.details, sneakerId]]

                this.connection.query(
                  insertStore,
                  dataStore,
                  (error, result: ResultSetHeader) => {
                    if (error) throw error

                    const storeId = result.insertId
                    const insertPrice =
                      'INSERT INTO prices (price, discount, store_id) VALUES (?)'
                    const dataPrice = [[item?.price, item?.discount, storeId]]

                    this.connection.query(insertPrice, dataPrice)

                    const insertPriceHistory =
                      'INSERT INTO prices_history (price_history, store_id) VALUES (?, ?)'
                    const dataPriceHistory = [item?.price, storeId]

                    this.connection.query(insertPriceHistory, dataPriceHistory)
                  }
                )
              }
            )
          }
        }
      )
    })
  }
}

export default new InsertSneakers()
