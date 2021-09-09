import { AuctionEventListener, PriceSource } from '../core'

export class AuctionEventTranslator {
  private listener: AuctionEventListener
  private sniperId: string

  constructor(sniperId: string, listener: AuctionEventListener) {
    this.listener = listener
    this.sniperId = sniperId
  }

  processEvent(eventName: string, eventData: any): void {
    switch(eventName) {
      case 'client-close': {
        this.listener.auctionClosed()
        break
      }
      case 'client-price': {
        const { currentPrice, increment, bidder } = eventData
        const source = this.sniperId === bidder ? PriceSource.FromSniper : PriceSource.FromOtherBidder
        this.listener.currentPrice(currentPrice, increment, source)
        break;
      }
    }
  }
}