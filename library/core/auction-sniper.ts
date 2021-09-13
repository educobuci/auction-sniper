import { Auction, AuctionEventListener, PriceSource } from './'
import { SniperListener, SniperState } from './ports'

export class AuctionSniper implements AuctionEventListener {
  private auction: Auction
  private sniperListener: SniperListener
  private isWinning = false
  private itemId: string

  constructor(itemId: string, auction: Auction, listener: SniperListener) {
    this.auction = auction
    this.sniperListener = listener
    this.itemId = itemId
  }

  currentPrice(price: number, increment: number, source: PriceSource): void {
    this.isWinning = source === PriceSource.FromSniper
    const bid = price + increment
    if(this.isWinning) {
      this.sniperListener.sniperWinning()
    } else {
      this.sniperListener.sniperStateChanged({ itemId: this.itemId, lastPrice: price,  lastBid: bid, state: SniperState.Bidding})
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