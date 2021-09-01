import { AuctionStatus } from 'lib/AuctionStatus'
import { Page } from 'puppeteer'

export default class AuctionSniperDriver {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async showsSniperStatus(status: AuctionStatus) {
    const el = await page.$x(`//div[contains(text(), '${status}')]`)
    expect(el.length).toEqual(1)
  }
}