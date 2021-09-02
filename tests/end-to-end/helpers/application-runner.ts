import 'expect-puppeteer'
import { Page } from 'puppeteer'
import { AuctionStatus } from '../../../lib/AuctionStatus'
import AuctionSniperDriver from './auction-sniper-driver'
import FakeAuctionServer from './fake-auction-server'

const APP_HOST = 'http://localhost:9000'

export default class ApplicationRunner {
  private appPage: Page
  private driver: AuctionSniperDriver

  async startBiddingIn(auction: FakeAuctionServer) {
    this.appPage = await browser.newPage()
    const itemId = auction.getItemId()
    const url = `${APP_HOST}/?item-id=${itemId}`
    await this.appPage.goto(url)
    this.driver = new AuctionSniperDriver(this.appPage)
    await this.driver.showsSniperStatus(AuctionStatus.Joining)
  }

  async showsSniperHasLostAuction() {
    await this.driver.showsSniperStatus(AuctionStatus.Lost)
  }

  async stop() {
    this.driver = null
    await this.appPage.close()
  }
}