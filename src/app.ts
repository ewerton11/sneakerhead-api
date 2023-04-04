import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import scraperNike from './integrations/sneakersNike'
import router from './router/sneakers'
import scraperAdidas from './integrations/originalsAdidas'

const app = express()

app.use(bodyParser.json())

app.use(cors())

const INTERVAL_IN_MILLISECONDS = 1800000 // 30 minutos em milissegundos
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const integration = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await scraperNike.searchOnNike()
    await scraperAdidas.searchOnAdidas()
    await sleep(INTERVAL_IN_MILLISECONDS)
  }
}

integration()

app.use('/', router)

export default app
