import { Auction, AuctionEventListener } from 'library/core'
import { SniperListener } from './ports'

export class AuctionSniper implements AuctionEventListener {
  auction: Auction
  sniperListener: SniperListener

  constructor(auction: Auction, listener: SniperListener) {
    this.auction = auction
    this.sniperListener = listener
  }

  currentPrice(price: number, increment: number): void {
    this.sniperListener.sniperBidding()
    this.auction.bid(price + increment)
  }

  auctionClosed() {
    this.sniperListener.sniperLost()
  }
}