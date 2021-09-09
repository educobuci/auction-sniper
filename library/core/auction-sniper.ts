import { Auction, AuctionEventListener, PriceSource } from './'
import { SniperListener } from './ports'

export class AuctionSniper implements AuctionEventListener {
  private auction: Auction
  private sniperListener: SniperListener
  private isWinning = false

  constructor(auction: Auction, listener: SniperListener) {
    this.auction = auction
    this.sniperListener = listener
  }

  currentPrice(price: number, increment: number, source: PriceSource): void {
    this.isWinning = source === PriceSource.FromSniper
    if(this.isWinning) {
      this.sniperListener.sniperWinning()
    } else {
      this.sniperListener.sniperBidding()
    }
    this.auction.bid(price + increment)
  }

  auctionClosed() {
    if(this.isWinning) {
      this.sniperListener.sniperWon()
    } else {
      this.sniperListener.sniperLost()
    }
  }
}