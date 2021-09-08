import 'expect-puppeteer'
import { AuctionStatus } from '../../../library/core/auction-status'
import AuctionSniperDriver from './auction-sniper-driver'
import FakeAuctionServer from './fake-auction-server'
import config from './config'

export default class ApplicationRunner {
  static readonly SNIPER_ID = 'sniper'
  private driver: AuctionSniperDriver

  constructor() {
    this.driver = new AuctionSniperDriver(page)
  }
  
  async startBiddingIn(auction: FakeAuctionServer) {
    page.on('console', (message) => console.log(message?.text()))
    const itemId = auction.getItemId()
    const url = `${config.host}/?item-id=${itemId}`
    page.goto(url)
    await this.driver.showsSniperStatus(AuctionStatus.Joining)
  }

  async showsSniperHasLostAuction() {
    await this.driver.showsSniperStatus(AuctionStatus.Lost)
  }

  async hasShownIsBidding() {
    await this.driver.showsSniperStatus(AuctionStatus.Bidding)
  }

  async stop() {
    this.driver = null
    await jestPuppeteer.resetPage()
  }
}