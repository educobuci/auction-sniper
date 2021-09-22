import 'expect-puppeteer'
import { SniperState } from '../../../library/core'
import AuctionSniperDriver from './auction-sniper-driver'
import FakeAuctionServer from './fake-auction-server'
import config from './config'

export default class ApplicationRunner {
  static readonly SNIPER_ID = 'sniper'
  private driver: AuctionSniperDriver

  constructor() {
    this.driver = new AuctionSniperDriver(page)
  }
  
  async startBiddingIn(... auctions: FakeAuctionServer[]) {
    const items = auctions.map(a => `items=${a.getItemId()}`).join('&')
    const url = `${config.host}/?${items}&sniper-id=${ApplicationRunner.SNIPER_ID}`
    page.on('console', (message) => console.log(message?.text()))
    page.goto(url)
    await this.driver.hasColumnTitles()
    for(const auction of auctions) {
      await this.driver.showsSniperState(auction.getItemId(), 0, 0, SniperState.Joining)
    }
  }

  async showsSniperHasLostAuction() {
    await this.driver.showsSniperStatus(SniperState.Lost)
  }

  async hasShownIsBidding() {
    await this.driver.showsSniperStatus(SniperState.Bidding)
  }

  async hasShownSniperIsBidding(auction: FakeAuctionServer, lastPrice: number, lastBid: number) {
    await this.driver.showsSniperState(auction.getItemId(), lastPrice, lastBid, SniperState.Bidding)
  }

  async hasShownSniperIsWinning(auction: FakeAuctionServer, winninBid: number) {
    await this.driver.showsSniperState(auction.getItemId(), winninBid, winninBid, SniperState.Winning)
  }

  async showsSniperHasWonAuction(auction: FakeAuctionServer, lastPrice: number) {
    await this.driver.showsSniperState(auction.getItemId(), lastPrice, lastPrice, SniperState.Won)
  }

  async stop() {
    this.driver = null
    await jestPuppeteer.resetPage()
  }
}