import { SniperState } from 'library/core'
import { Page } from 'puppeteer'

const TIMEOUT = 3000

export default class AuctionSniperDriver {
  appPage: Page

  constructor(appPage: Page) {
    this.appPage = appPage
  }

  async showsSniperStatus(state: SniperState) {
    await this.waitSelectorWithInnerText('tbody td', state)
  }

  async showsSniperState(itemId: string, lastPrice: number, lastBid: number, state: SniperState) {
    const innerText = [itemId, lastPrice, lastBid, state].join('\t')
    await this.waitSelectorWithInnerText('tbody tr', innerText)
  }

  async hasColumnTitles() {
    const columns = ['Item', 'Last Price', 'Last Bid', 'State'].join('\t')
    await this.waitSelectorWithInnerText('thead tr', columns)
  }

  private async waitSelectorWithInnerText(selector: string, innerText: string) {
    const selectorCode = `Array.from(document.querySelectorAll('${selector}').values())`
    try {
      await page.waitForFunction(`${selectorCode}.some(el => el.innerText === '${innerText}')`, { timeout: TIMEOUT })
    } catch {
      const value = await page.waitForFunction(`${selectorCode}.map(el => el.innerText)`).then(e => e.jsonValue<string>())
      expect(value).toContain(innerText)
    }
  }
}