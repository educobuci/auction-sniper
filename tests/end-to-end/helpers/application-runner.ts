import 'expect-puppeteer'
import { AuctionStatus } from '../../../library/core'
import AuctionSniperDriver from './auction-sniper-driver'
import FakeAuctionServer from './fake-auction-server'
import config from './config'

export default class ApplicationRunner {
  static readonly SNIPER_ID = 'sniper'
  private driver: AuctionSniperDriver
  private itemId: string

  constructor() {
    this.driver = new AuctionSniperDriver(page)
  }
  
  async startBiddingIn(auction: FakeAuctionServer) {
    this.itemId = auction.getItemId()
    page.on('console', (message) => console.log(message?.text()))
    const url = `${config.host}/?item-id=${this.itemId}&sniper-id=${ApplicationRunner.SNIPER_ID}`
    page.goto(url)
    await this.driver.showsSniperStatus(AuctionStatus.Joining)
  }

  async showsSniperHasLostAuction() {
    await this.driver.showsSniperStatus(AuctionStatus.Lost)
  }

  async hasShownIsBidding() {
    await this.driver.showsSniperStatus(AuctionStatus.Bidding)
  }

  async hasShownSniperIsBidding(lastPrice: number, lastBid: number) {
    await this.driver.showsSniperState(this.itemId, lastPrice, lastBid, AuctionStatus.Bidding)
  }

  async hasShownSniperIsWinning(winninBid: number) {
    await this.driver.showsSniperState(this.itemId, winninBid, winninBid, AuctionStatus.Winning)
  }

  async showsSniperHasWonAuction(lastPrice: number) {
    await this.driver.showsSniperState(this.itemId, lastPrice, lastPrice, AuctionStatus.Won)
  }

  async stop() {
    this.driver = null
    await jestPuppeteer.resetPage()
  }
}