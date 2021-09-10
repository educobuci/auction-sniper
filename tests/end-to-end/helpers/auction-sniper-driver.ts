import { AuctionStatus } from 'library/core'
import { Page } from 'puppeteer'

const TIMEOUT = 3000

export default class AuctionSniperDriver {
  appPage: Page

  constructor(appPage: Page) {
    this.appPage = appPage
  }

  async showsSniperStatus(status: AuctionStatus) {
    await this.waitSelectorWithInnerText('tbody tr', status)
  }

  async showsSniperState(itemId: string, lastPrice: number, lastBid: number, status: AuctionStatus) {
    const innerText = [itemId, lastPrice, lastBid, status].join('\t')
    await this.waitSelectorWithInnerText('tbody tr', innerText)
  }

  private async waitSelectorWithInnerText(selector: string, innerText: string) {
    try {
      await page.waitForFunction(
        `document.querySelector("${selector}")?.innerText.includes("${innerText}")`,
        { timeout: TIMEOUT }
      )
    } catch {
      const error = `Timeout: Selector '${selector}' with inner text '${innerText}' not found.`
      console.error(error)
      const value = await page.waitForFunction(`document.querySelector("${selector}")?.innerText`).then(e => e.jsonValue<string>())
      expect(value).toEqual(innerText)
    }
  }
}