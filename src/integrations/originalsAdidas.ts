import puppeteer, { Browser, Page } from 'puppeteer'
import insertSneakers from '../services/insertSneakers'
import { IDataSneakers } from './sneakersNike'

class ScraperAdidas {
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
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    )
  }

  async accessThePage() {
    await this.page.goto('https://www.adidas.com.br/originals-tenis-homem')
  }

  async scroll() {
    await this.page.evaluate(() => {
      window.scrollBy({ top: 500, behavior: 'smooth' })
    })

    const scrollHeight = await this.page.evaluate(async () => {
      const element = document.querySelector(
        '.main-container___1Y0Q_'
      ) as HTMLElement

      const height = element.scrollHeight
      const scrollPosition = window.scrollY

      const scrollPercentage = (scrollPosition / height) * 100
      const below98 = scrollPercentage > 98

      return below98
    })
    return scrollHeight
  }

  async nextPage() {
    const endOfPage: boolean = await this.page.evaluate(async () => {
      const paginationNext = document.querySelector(
        '.pagination_margin--next___3H3Zd > a'
      ) as HTMLElement

      if (paginationNext) {
        paginationNext.click()
        await new Promise((resolve) => setTimeout(resolve, 5000))
        return true
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10000))
        return false
      }
    })
    return endOfPage
  }

  async getSneakersData() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const scrollHeight = await this.scroll()

      if (scrollHeight) {
        const informationsSneakers = await this.page.evaluate(async () => {
          const elements = Array.from(
            document.querySelectorAll(
              '#main-content > div.plp-results-page___22Rwb > div:nth-child(3) > div >' +
                ' div > div > div.product-container___3GvlZ > div > div'
            )
          )

          const info: Array<IDataSneakers> = []

          elements.forEach((items) => {
            const name =
              items.querySelector('p.glass-product-card__title')?.textContent ??
              ''

            const stringPrice = items.querySelector(
              'a.product-card-content-badges-wrapper___2RWqS > div > div > div'
            )?.textContent
            const price = stringPrice
              ? parseFloat(stringPrice.replace(/\D/g, ''))
              : 0

            const previousPriceString = items.querySelector(
              'a.product-card-content-badges-wrapper___2RWqS > div:nth-child(2) > ' +
                'div > div.gl-price-item.gl-price-item--crossed.notranslate'
            )?.textContent
            const previous_price = previousPriceString
              ? parseFloat(previousPriceString.replace(/\D/g, ''))
              : null

            const stringDiscount = items.querySelector(
              'a.product-card-content-badges-wrapper___2RWqS > ' +
                'div.badge-container___1TJjk.discount-badge___318Q7 > span'
            )?.textContent
            const discount = stringDiscount
              ? parseFloat(stringDiscount.replace(/\D/g, ''))
              : null

            const details = items.querySelector('a')?.href ?? ''
            const image = items.querySelector('img')?.getAttribute('src') ?? ''

            info.push({
              name,
              price,
              previous_price,
              discount,
              image,
              brand: 'adidas',
              store: 'adidas',
              details,
            })
          })

          return info
        })

        const endOfPage = await this.nextPage()

        const infoSneakers = informationsSneakers.filter((items) => {
          return items !== null && items.name !== ''
        })

        await insertSneakers.insertData(infoSneakers)

        if (!endOfPage) {
          break
        }
      }
    }
  }

  async closeBrowser() {
    await this.browser.close()
  }

  async searchOnAdidas() {
    console.log('adidas data scraping started!')
    await this.configScraper()
    await this.accessThePage()
    await this.getSneakersData()
    await this.closeBrowser()
    console.log('adidas data scraping completed!')
  }
}

export default new ScraperAdidas()
