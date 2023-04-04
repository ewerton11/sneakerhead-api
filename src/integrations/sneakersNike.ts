import puppeteer, { Browser, Page } from 'puppeteer'
import insertSneakers from '../services/insertSneakers'

export interface IDataSneakers {
  name: string
  price: number
  previous_price: number | null
  discount: number | null
  image: string
  brand: string
  store: string
  details: string
}

class ScraperNike {
  private browser: Browser = new Browser()
  private page: Page = new Page()

  async configScraper() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    })
    this.page = await this.browser.newPage()
    this.page.setDefaultTimeout(60000)
    // this.page.setDefaultNavigationTimeout(0)

    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/89.0.4389.82 Safari/537.36'
    )
  }

  async accessThePage() {
    await this.page.goto(
      'https://www.nike.com.br/nav/esportes/casual/genero/masculino/idade/adulto/tipodeproduto/calcados'
      // { waitUntil: 'networkidle0' }
    )
  }

  async loadSneakersData() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await this.page.evaluate(async () => {
        window.scrollBy({
          top: 500,
          behavior: 'smooth',
        })
      })

      const porcento = await this.page.evaluate(async () => {
        const scrollPosition = window.scrollY
        const totalHeight = document.body.scrollHeight

        const scrollPercentage = (scrollPosition / totalHeight) * 100
        const below95 = scrollPercentage < 95

        if (scrollPercentage > 85) {
          await new Promise((resolve) => setTimeout(resolve, 5000))
        }

        return below95
      })

      if (!porcento) break
    }
  }

  async getSneakersData() {
    const informationsSneakers = await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.laeIEP'))

      return elements.map((items) => {
        const name = items.querySelector('p')?.textContent ?? ''

        const stringPrice = items.querySelector(
          'div:nth-child(3) > p'
        )?.textContent
        const price = stringPrice
          ? parseFloat(stringPrice.replace(/\D/g, ''))
          : 0

        const previousPriceString = items.querySelector(
          '.cQXowe > p:nth-child(2)'
        )?.textContent
        const previous_price = previousPriceString
          ? parseFloat(previousPriceString.replace(/\D/g, ''))
          : null

        const stringDiscount =
          items.querySelector('p:nth-child(3)')?.textContent
        const discount = stringDiscount
          ? parseFloat(stringDiscount.replace(/\D/g, ''))
          : null

        const details = items.querySelector('a')?.getAttribute('href') ?? ''
        const image =
          items
            .querySelector('a > div:nth-child(1) > span > img')
            ?.getAttribute('src') ?? ''

        return {
          name,
          price,
          previous_price,
          discount,
          image,
          brand: 'nike',
          store: 'nike',
          details: `https://www.nike.com.br${details}`,
        }
      })
    })

    await insertSneakers.insertData(informationsSneakers)
  }

  async closeBrowser() {
    await this.browser.close()
  }

  async searchOnNike() {
    console.log('nike data scraping started!')
    await this.configScraper()
    await this.accessThePage()
    await this.loadSneakersData()
    await this.getSneakersData()
    await this.closeBrowser()
    console.log('nike data scraping completed!')
  }
}

export default new ScraperNike()
