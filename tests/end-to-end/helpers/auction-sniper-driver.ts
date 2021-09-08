import { AuctionStatus } from 'library/core'
import { Page } from 'puppeteer'

const TIMEOUT = 3000

export default class AuctionSniperDriver {
  appPage: Page

  constructor(appPage: Page) {
    this.appPage = appPage
  }

  async showsSniperStatus(status: AuctionStatus) {
    try {
      await page.waitForFunction(
        `document.querySelector("#status-label").innerText.includes("${status}")`,
        { timeout: TIMEOUT }
      )
    } catch {}
    const label = await page.waitForSelector('#status-label')
    const value = await label.evaluate(el => el.textContent)
    expect(value).toEqual(status)
  }
}