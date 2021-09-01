import 'expect-puppeteer'
import { AuctionStatus } from '../../../lib/AuctionStatus'
import AuctionSniperDriver from './auction-sniper-driver'
import FakeAuctionServer from './fake-auction-server'

const SNIPER_ID = 'sniper'
const SNIPER_PASSWORD = 'sniper'
const APP_HOST = 'http://localhost:9000'

export default class ApplicationRunner {
  private driver: AuctionSniperDriver

  async startBiddingIn(auction: FakeAuctionServer) {
    const itemId = auction.getItemId()
    const url = `${APP_HOST}/?item-id=${itemId}`
    await page.authenticate({ username: SNIPER_ID, password: SNIPER_PASSWORD })
    await page.goto(url)
    this.driver = new AuctionSniperDriver(page)
    await this.driver.showsSniperStatus(AuctionStatus.Joining)
  }

  async showsSniperHasLostAuction() {
    await this.driver.showsSniperStatus(AuctionStatus.Lost)
  }

  stop() {
    this.driver = null
  }
}