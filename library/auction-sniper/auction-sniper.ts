import AuctionEventListener from 'library/auction-event-listener'
import { Auction } from 'library/auction/ports'
import { SniperListener } from './ports'

export default class AuctionSniper implements AuctionEventListener {
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