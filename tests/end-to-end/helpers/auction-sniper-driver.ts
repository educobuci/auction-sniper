import { AuctionStatus } from 'library/AuctionStatus'
import { Page } from 'puppeteer'

export default class AuctionSniperDriver {
  appPage: Page

  constructor(appPage: Page) {
    this.appPage = appPage
  }

  async showsSniperStatus(status: AuctionStatus) {
    await page.waitForFunction(
      `document.querySelector("#status-label").innerText.includes("${status}")`
    )
  }
}