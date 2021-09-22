import { Auction, AuctionEventListener, PriceSource } from './'
import { SniperListener } from './ports'
import { SniperSnapshot } from './sniper-snapshot'

export class AuctionSniper implements AuctionEventListener {
  private auction: Auction
  private sniperListener: SniperListener
  private isWinning = false
  private snapshot: SniperSnapshot

  constructor(itemId: string, auction: Auction, listener: SniperListener) {
    this.auction = auction
    this.sniperListener = listener
    this.snapshot = SniperSnapshot.joining(itemId)
  }

  currentPrice(price: number, increment: number, source: PriceSource): void {
    this.isWinning = source === PriceSource.FromSniper
    if(this.isWinning) {
      this.snapshot = this.snapshot.winning(price)
    } else {
      const bid = price + increment
      this.snapshot = this.snapshot.bidding(price, bid)
    }
    this.notifyChange()
    this.auction.bid(price + increment)
  }

  auctionClosed() {
    if(this.isWinning) {
      this.snapshot = this.snapshot.won()
    } else {
      this.snapshot = this.snapshot.lost()
    }
    this.notifyChange()
  }

  private notifyChange(): void {
    this.sniperListener.sniperStateChanged(this.snapshot)
  }
}