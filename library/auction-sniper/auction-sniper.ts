import AuctionEventListener from 'library/auction-event-listener'
import { SniperListener } from './ports'

export default class AuctionSniper implements AuctionEventListener {
  sniperListener: SniperListener

  constructor(listener: SniperListener) {
    this.sniperListener = listener
  }

  currentPrice(price: number, increment: number): void {
    throw new Error('Method not implemented.')
  }

  auctionClosed() {
    this.sniperListener.sniperLost()
  }
}