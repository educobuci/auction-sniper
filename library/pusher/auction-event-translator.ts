import { AuctionEventListener } from '../core'

export class AuctionEventTranslator {
  private listener: AuctionEventListener

  constructor(listener: AuctionEventListener) {
    this.listener = listener
  }

  processEvent(eventName: string, eventData: any): void {
    switch(eventName) {
      case 'client-close': {
        this.listener.auctionClosed()
        break
      }
      case 'client-price': {
        this.listener.currentPrice(eventData.currentPrice, eventData.increment)
        break;
      }
    }
  }
}