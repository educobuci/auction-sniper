import { AuctionStatus } from 'lib/AuctionStatus'
import { Page } from 'puppeteer'

export default class AuctionSniperDriver {
  appPage: Page

  constructor(appPage: Page) {
    this.appPage = appPage
  }

  async showsSniperStatus(status: AuctionStatus) {
    const el = await this.appPage.$x(`//div[contains(text(), '${status}')]`)
    expect(el.length).toEqual(1)
  }
}